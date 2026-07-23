from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from knn_engine import knn_engine

app = FastAPI(
    title="CineMatch Recommendation Service",
    description="KNN Collaborative Filtering Recommendation Engine powered by scikit-learn",
    version="1.0.1"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MovieRatingItem(BaseModel):
    movie_id: int
    rating: float = Field(..., ge=0.5, le=5.0)

class UserRatingSyncItem(BaseModel):
    user_id: str
    movie_id: int
    rating: float

class MovieRecommendRequest(BaseModel):
    movie_id: int
    top_n: Optional[int] = 6

class UserRecommendRequest(BaseModel):
    user_id: str
    user_ratings: List[MovieRatingItem] = []
    top_n: Optional[int] = 10

class CustomInputRecommendRequest(BaseModel):
    genres: Optional[List[str]] = []
    mood: Optional[str] = None
    language: Optional[str] = None
    era: Optional[str] = None
    min_rating: Optional[float] = 0.0
    prompt_query: Optional[str] = None
    user_ratings: Optional[List[MovieRatingItem]] = []
    top_n: Optional[int] = 12

class SyncRatingsRequest(BaseModel):
    ratings: List[UserRatingSyncItem]

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "CineMatch ML Engine",
        "total_movies_in_matrix": len(knn_engine.movie_ids),
        "total_ratings_count": len(knn_engine.ratings)
    }

@app.post("/recommend/movie")
def recommend_similar_movies(req: MovieRecommendRequest):
    """
    Item-based KNN endpoint: Returns top N similar movies using Cosine Similarity
    """
    try:
        recommendations = knn_engine.get_similar_movies(movie_id=req.movie_id, top_n=req.top_n)
        return {
            "movie_id": req.movie_id,
            "count": len(recommendations),
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/user")
def recommend_for_user(req: UserRecommendRequest):
    """
    Personalized User Recommendation endpoint:
    Calculates KNN recommendations based on user rating history, with < 3 rating cold-start fallback.
    """
    try:
        ratings_list = [{"movie_id": r.movie_id, "rating": r.rating} for r in req.user_ratings]
        result = knn_engine.get_user_recommendations(user_ratings=ratings_list, top_n=req.top_n)
        return {
            "user_id": req.user_id,
            "cold_start": result.get("cold_start", False),
            "reason": result.get("reason"),
            "recommendations": result.get("recommendations", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend/custom")
def recommend_by_custom_inputs(req: CustomInputRecommendRequest):
    """
    Custom User Input Recommendation Endpoint:
    Calculates hybrid recommendations matching genres, mood, era, rating, keyword prompt, and rated movies.
    """
    try:
        ratings_list = [{"movie_id": r.movie_id, "rating": r.rating} for r in (req.user_ratings or [])]
        result = knn_engine.get_custom_input_recommendations(
            genres=req.genres,
            mood=req.mood,
            era=req.era,
            min_rating=req.min_rating,
            prompt_query=req.prompt_query,
            user_ratings=ratings_list,
            top_n=req.top_n or 12
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sync-ratings")
def sync_live_ratings(req: SyncRatingsRequest):
    """
    Syncs live ratings from MongoDB to rebuild the sparse matrix
    """
    try:
        ratings_dicts = [r.dict() for r in req.ratings]
        knn_engine.add_user_ratings(ratings_dicts)
        return {
            "status": "success",
            "message": f"Successfully synced {len(req.ratings)} ratings.",
            "total_ratings": len(knn_engine.ratings)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
