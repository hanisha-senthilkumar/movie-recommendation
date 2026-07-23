# CineMatch — AI-Powered Movie Recommendation Platform 🎬

**CineMatch** is a full-stack cinema-inspired movie recommendation platform powered by an item-based **K-Nearest Neighbors (KNN)** collaborative filtering microservice using cosine similarity on user-item rating matrices.

---

## 🌟 Key Features

- **Cinematic Noir Visual Identity**: Moody dark palette (`#0B0D12` charcoal, `#F2B84B` warm amber, `#B3273A` crimson), ambient 10-second rotating TMDB movie backdrops with subtle film-grain overlays, and glassmorphic card elements.
- **KNN Recommendation Microservice**: Python FastAPI service utilizing `scikit-learn.neighbors.NearestNeighbors(metric='cosine')`.
- **Cold-Start Resilience**: Seamless fallback to trending lists when a user has fewer than 3 ratings; personalizes automatically once 3+ ratings are recorded.
- **Full-Stack Authentication**: Node.js + Express backend with JWT tokens stored in `httpOnly` secure cookies, bcrypt password hashing, and real-time frontend password strength meter.
- **Interactive Cinema Vault**: Search live titles, rate movies from 1 to 5 stars, add titles to your personal watchlist, and view cast profiles and KNN similarity scores.
- **Zero-Setup Database Fallback**: Connects to local MongoDB automatically, with built-in instant in-memory DB fallback if local MongoDB is offline.

---

## 🏗️ Architecture Overview

```
                                 ┌───────────────────────────┐
                                 │   React Frontend (Vite)   │
                                 │   Framer Motion + Tailwind│
                                 └─────────────┬─────────────┘
                                               │ HTTP / REST
                                               ▼
                                 ┌───────────────────────────┐
                                 │  Node.js + Express API    │
                                 │  JWT Auth + Mongoose DB   │
                                 └──────┬──────────────┬─────┘
                                        │              │
                    TMDB API / Fallback │              │ REST API
                                        ▼              ▼
                                 ┌────────────┐  ┌─────────────────────────────┐
                                 │ TMDB API   │  │ Python ML Service (FastAPI) │
                                 │ Movie Data │  │ scikit-learn KNN Engine     │
                                 └────────────┘  └─────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.9+ (tested on 3.13)

### Installation & Launch

1. **Install Root & Service Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start the Python ML Microservice**:
   ```bash
   cd ml-service
   pip install -r requirements.txt
   python main.py
   ```
   *(Server starts on `http://localhost:8000`)*

3. **Start the Node.js Express Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   *(Server starts on `http://localhost:5000`)*

4. **Start the React Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   *(App open at `http://localhost:5173`)*

---

## 🧠 KNN Collaborative Filtering Logic

The recommendation engine implements **Item-Based Collaborative Filtering** with **Cosine Distance**:

$$\text{Cosine Similarity}(A, B) = \frac{A \cdot B}{\|A\| \|B\|}$$

1. **User-Item Sparse Matrix**: Matrix constructed with items (movies) as rows and users as columns.
2. **Nearest Neighbors Training**: `scikit-learn` fits a brute-force model over cosine distances.
3. **Personalized Scoring**: When a user submits ratings $R_u$, candidate unrated movies $M_c$ are weighted according to their cosine similarity $S(M_c, r)$ with movies rated highly by user $u$:

$$\text{Score}(M_c) = \frac{\sum_{r \in R_u} S(M_c, r) \times \text{Rating}(r)}{\sum S(M_c, r)}$$

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in the backend directory:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Node Express server port |
| `JWT_SECRET` | `cinematch_super_secret_jwt_key_2026` | Secret key for signing JWT cookies |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/cinematch` | Mongo connection URI (Auto-fallback to memory DB if offline) |
| `TMDB_API_KEY` | `""` | TMDB API Key (Auto-fallback to curated TMDB catalog if omitted) |
| `ML_SERVICE_URL` | `http://127.0.0.1:8000` | Python FastAPI ML service endpoint |
