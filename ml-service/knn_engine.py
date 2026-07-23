import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from data.movies_seed import MOVIES_SEED, SEED_RATINGS

class KNNRecommendationEngine:
    def __init__(self):
        self.movies_df = pd.DataFrame(MOVIES_SEED)
        self.movies_map = {m["id"]: m for m in MOVIES_SEED}
        self.ratings = list(SEED_RATINGS)
        self.model = None
        self.item_user_matrix = None
        self.movie_ids = []
        self.user_ids = []
        self._rebuild_matrix()

    def add_user_ratings(self, new_ratings):
        """
        Dynamically merges live user ratings from MongoDB into the ratings list
        and updates the KNN model matrix.
        new_ratings: list of dicts {"user_id": str, "movie_id": int, "rating": float}
        """
        if not new_ratings:
            return
        
        # Add new ratings or update existing ratings
        for r in new_ratings:
            found = False
            for existing in self.ratings:
                if str(existing["user_id"]) == str(r["user_id"]) and int(existing["movie_id"]) == int(r["movie_id"]):
                    existing["rating"] = float(r["rating"])
                    found = True
                    break
            if not found:
                self.ratings.append({
                    "user_id": str(r["user_id"]),
                    "movie_id": int(r["movie_id"]),
                    "rating": float(r["rating"])
                })
        
        self._rebuild_matrix()

    def _rebuild_matrix(self):
        """
        Builds the item-user rating matrix where rows are movies (items)
        and columns are users. Fits scikit-learn's NearestNeighbors model with cosine similarity.
        """
        if not self.ratings:
            return

        df_ratings = pd.DataFrame(self.ratings)
        
        # Pivot table: Index = movie_id, Columns = user_id, Values = rating
        pivot = df_ratings.pivot(index='movie_id', columns='user_id', values='rating').fillna(0)
        
        self.item_user_matrix = pivot
        self.movie_ids = pivot.index.tolist()
        self.user_ids = pivot.columns.tolist()

        # Fit NearestNeighbors model with Cosine Distance
        # Cosine distance = 1 - Cosine similarity
        self.model = NearestNeighbors(metric='cosine', algorithm='brute')
        self.model.fit(pivot.values)

    def get_similar_movies(self, movie_id: int, top_n: int = 6):
        """
        Item-based KNN recommendation: Returns top N movies most similar to given movie_id
        """
        movie_id = int(movie_id)
        if movie_id not in self.movie_ids:
            # Fallback if movie not in pivot matrix: return genre-based or popular movies
            return self._fallback_movies(movie_id=movie_id, top_n=top_n)

        movie_idx = self.movie_ids.index(movie_id)
        movie_vector = self.item_user_matrix.iloc[movie_idx].values.reshape(1, -1)

        # Retrieve nearest neighbors
        n_neighbors = min(top_n + 1, len(self.movie_ids))
        distances, indices = self.model.kneighbors(movie_vector, n_neighbors=n_neighbors)

        recommendations = []
        for dist, idx in zip(distances[0], indices[0]):
            neighbor_movie_id = self.movie_ids[idx]
            if neighbor_movie_id == movie_id:
                continue # Skip the target movie itself
            
            similarity_score = float(round(1.0 - dist, 4)) # Cosine similarity = 1 - distance
            movie_data = self.movies_map.get(neighbor_movie_id, {
                "id": neighbor_movie_id,
                "title": f"Movie {neighbor_movie_id}",
                "poster_path": None,
                "backdrop_path": None,
                "vote_average": 7.5
            })
            
            recommendations.append({
                "movie_id": neighbor_movie_id,
                "similarity_score": similarity_score,
                "movie": movie_data
            })
            if len(recommendations) >= top_n:
                break

        return recommendations

    def get_user_recommendations(self, user_ratings: list, top_n: int = 10):
        """
        Personalized User Collaborative Filtering using item-item KNN:
        Calculates predicted affinity score for candidate movies based on user's rated movies.
        user_ratings: list of dicts [{"movie_id": int, "rating": float}]
        
        Cold-Start Rule:
        If user has fewer than 3 ratings, returns popular cold-start list.
        """
        # Cold start handling (< 3 ratings)
        if not user_ratings or len(user_ratings) < 3:
            return {
                "cold_start": True,
                "reason": "Cold start: User has fewer than 3 ratings.",
                "recommendations": self._get_popular_movies(top_n=top_n)
            }

        user_rated_dict = {int(r["movie_id"]): float(r["rating"]) for r in user_ratings}
        candidate_scores = {}

        # For each movie the user has rated highly (rating >= 3.0)
        for rated_id, user_rating in user_rated_dict.items():
            if rated_id not in self.movie_ids:
                continue
            
            similar_movies = self.get_similar_movies(movie_id=rated_id, top_n=10)
            for item in similar_movies:
                cand_id = item["movie_id"]
                if cand_id in user_rated_dict:
                    continue # Skip movies user already rated
                
                sim_score = item["similarity_score"]
                # Weighted score = similarity * user's rating weight
                weighted_val = sim_score * (user_rating / 5.0)
                
                if cand_id not in candidate_scores:
                    candidate_scores[cand_id] = {"total_weighted_sim": 0.0, "total_sim": 0.0}
                candidate_scores[cand_id]["total_weighted_sim"] += weighted_val
                candidate_scores[cand_id]["total_sim"] += sim_score

        # Sort candidate movies by predicted recommendation score
        ranked_candidates = []
        for cand_id, stats in candidate_scores.items():
            final_score = stats["total_weighted_sim"] / max(stats["total_sim"], 0.0001)
            final_score = float(round(final_score, 4))
            
            movie_data = self.movies_map.get(cand_id, {
                "id": cand_id,
                "title": f"Movie {cand_id}",
                "poster_path": None,
                "backdrop_path": None,
                "vote_average": 8.0
            })
            
            ranked_candidates.append({
                "movie_id": cand_id,
                "score": final_score,
                "movie": movie_data
            })

        ranked_candidates.sort(key=lambda x: x["score"], reverse=True)

        if not ranked_candidates:
            # Fallback if matrix coverage was sparse
            return {
                "cold_start": True,
                "reason": "Fallback: Matrix coverage sparse.",
                "recommendations": self._get_popular_movies(top_n=top_n)
            }

        return {
            "cold_start": False,
            "recommendations": ranked_candidates[:top_n]
        }

    def get_custom_input_recommendations(
        self,
        genres: list = None,
        mood: str = None,
        era: str = None,
        min_rating: float = 0.0,
        prompt_query: str = None,
        user_ratings: list = None,
        top_n: int = 12
    ):
        """
        Calculates hybrid recommendations based on user inputs:
        - Genres selected
        - Mood / Vibe selected
        - Era / Decade filter
        - Minimum IMDB/TMDB rating threshold
        - Natural language prompt / keyword search
        - Rated movies for KNN collaborative weighting
        """
        genres = [g.lower() for g in (genres or []) if g and g != 'All']
        mood_str = (mood or "").lower()
        prompt_words = [w.lower() for w in (prompt_query or "").split() if len(w) > 2]
        user_rated_dict = {int(r["movie_id"]): float(r["rating"]) for r in (user_ratings or [])}

        mood_keywords = {
            "mind-bending": ["sci-fi", "dream", "time", "space", "reality", "matrix", "twist", "illusion", "mind", "memory", "quantum"],
            "adrenaline rush": ["action", "chase", "battle", "thriller", "war", "survival", "fight", "explosion", "agent", "superhero"],
            "dark & gritty": ["crime", "dark", "murder", "revenge", "noir", "mystery", "detective", "psychological", "corruption", "batman"],
            "feel-good": ["comedy", "family", "animation", "friendship", "fun", "uplifting", "heartwarming", "adventure", "toy", "journey"],
            "thought-provoking": ["drama", "history", "biography", "philosophy", "society", "truth", "justice", "human", "freedom", "war"],
            "romantic": ["romance", "love", "couple", "relationship", "heart", "passion", "wedding", "romantic"]
        }

        # Retrieve relevant mood target keywords
        active_mood_keys = []
        for key, klist in mood_keywords.items():
            if key in mood_str:
                active_mood_keys.extend(klist)

        # Precompute KNN similarity scores if user ratings provided
        knn_scores = {}
        if user_rated_dict and len(user_rated_dict) >= 1:
            for rated_id, rating in user_rated_dict.items():
                if rated_id in self.movie_ids:
                    similar = self.get_similar_movies(movie_id=rated_id, top_n=15)
                    for item in similar:
                        cid = item["movie_id"]
                        if cid in user_rated_dict:
                            continue
                        sim = item["similarity_score"] * (rating / 5.0)
                        knn_scores[cid] = max(knn_scores.get(cid, 0.0), sim)

        scored_movies = []

        for movie in MOVIES_SEED:
            m_id = movie["id"]

            # 1. Rating threshold check
            vote_avg = movie.get("vote_average", 7.0)
            if min_rating > 0 and vote_avg < min_rating:
                continue

            # 2. Era check
            release_date = movie.get("release_date", "")
            year = int(release_date.split("-")[0]) if release_date and "-" in release_date else 2010
            if era:
                era_l = era.lower()
                if "80" in era_l or "90" in era_l:
                    if year >= 2000:
                        continue
                elif "2000" in era_l:
                    if year < 2000 or year >= 2010:
                        continue
                elif "modern" in era_l or "2010" in era_l:
                    if year < 2010:
                        continue

            m_genres = [g.lower() for g in movie.get("genres", [])]
            overview = (movie.get("overview", "") + " " + movie.get("title", "")).lower()

            # Genre score
            genre_score = 0.0
            if genres:
                matched_genres = [g for g in genres if g in m_genres]
                genre_score = len(matched_genres) / len(genres)

            # Mood score
            mood_score = 0.0
            if active_mood_keys:
                matches = sum(1 for kw in active_mood_keys if kw in overview or any(kw in g for g in m_genres))
                mood_score = min(matches / max(len(active_mood_keys), 1), 1.0)

            # Prompt score
            prompt_score = 0.0
            if prompt_words:
                matches = sum(1 for pw in prompt_words if pw in overview or any(pw in g for g in m_genres))
                prompt_score = min(matches / max(len(prompt_words), 1), 1.0)

            # KNN score
            knn_val = knn_scores.get(m_id, 0.0)

            # Weighted Hybrid Total Score
            weights = []
            values = []

            if genres:
                weights.append(0.35)
                values.append(genre_score)
            if active_mood_keys:
                weights.append(0.25)
                values.append(mood_score)
            if prompt_words:
                weights.append(0.30)
                values.append(prompt_score)
            if knn_val > 0:
                weights.append(0.30)
                values.append(knn_val)

            # Base rating contribution
            weights.append(0.15)
            values.append(vote_avg / 10.0)

            total_weight = sum(weights)
            total_score = sum(w * v for w, v in zip(weights, values)) / total_weight if total_weight > 0 else (vote_avg / 10.0)

            # Convert to match percentage (75% to 99%)
            match_pct = int(min(max(total_score * 100, 72.0), 99.0))

            # Build match tags
            tags = []
            if genres:
                matched_g = [g.capitalize() for g in genres if g in m_genres]
                if matched_g:
                    tags.append(matched_g[0])
            if mood_str:
                tags.append(mood_str.title())
            tags.append(f"{vote_avg} ★")

            scored_movies.append({
                "movie_id": m_id,
                "score": float(round(total_score, 4)),
                "match_percentage": match_pct,
                "match_tags": tags,
                "movie": movie
            })

        scored_movies.sort(key=lambda x: (x["match_percentage"], x["score"]), reverse=True)

        return {
            "total_matches": len(scored_movies),
            "recommendations": scored_movies[:top_n]
        }

    def _get_popular_movies(self, top_n: int = 10):
        """Returns highest rated seed movies for cold start fallback"""
        sorted_seed = sorted(MOVIES_SEED, key=lambda m: m.get("vote_average", 0), reverse=True)
        return [
            {
                "movie_id": m["id"],
                "score": 1.0,
                "movie": m
            }
            for m in sorted_seed[:top_n]
        ]

    def _fallback_movies(self, movie_id: int, top_n: int = 6):
        """Fallback recommendation when movie isn't in KNN matrix"""
        target_movie = self.movies_map.get(movie_id)
        target_genres = set(target_movie["genres"]) if target_movie and "genres" in target_movie else set()

        matches = []
        for m in MOVIES_SEED:
            if m["id"] == movie_id:
                continue
            m_genres = set(m.get("genres", []))
            common = len(target_genres.intersection(m_genres))
            sim = 0.5 + (0.1 * common)
            matches.append({
                "movie_id": m["id"],
                "similarity_score": round(sim, 2),
                "movie": m
            })
        
        matches.sort(key=lambda x: x["similarity_score"], reverse=True)
        return matches[:top_n]

# Global instance
knn_engine = KNNRecommendationEngine()

