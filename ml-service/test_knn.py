from knn_engine import knn_engine

def test_knn_engine():
    print("--- Testing KNN Engine ---")
    print("Matrix Movie Count:", len(knn_engine.movie_ids))

    # Test 1: Similar to Inception (27205)
    print("\n1. Finding movies similar to Inception (27205)...")
    sims = knn_engine.get_similar_movies(27205, top_n=5)
    for idx, item in enumerate(sims, 1):
        print(f"  {idx}. {item['movie']['title']} (Score: {item['similarity_score']})")

    # Test 2: User Cold Start (< 3 ratings)
    print("\n2. User Cold-Start test (1 rating)...")
    cold_res = knn_engine.get_user_recommendations([{"movie_id": 27205, "rating": 5.0}], top_n=5)
    print("  Cold start triggered:", cold_res["cold_start"])
    print("  First recommendation:", cold_res["recommendations"][0]["movie"]["title"])

    # Test 3: Personalized Recommendations (3+ ratings)
    print("\n3. Personalized user test (Inception 5.0, Interstellar 5.0, Matrix 4.5)...")
    user_ratings = [
        {"movie_id": 27205, "rating": 5.0}, # Inception
        {"movie_id": 157336, "rating": 5.0}, # Interstellar
        {"movie_id": 603, "rating": 4.5}   # Matrix
    ]
    rec_res = knn_engine.get_user_recommendations(user_ratings, top_n=5)
    print("  Cold start triggered:", rec_res["cold_start"])
    for idx, item in enumerate(rec_res["recommendations"], 1):
        print(f"  {idx}. {item['movie']['title']} (Score: {item['score']})")

if __name__ == "__main__":
    test_knn_engine()
