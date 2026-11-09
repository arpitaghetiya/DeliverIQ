# DeliverIQ — Intelligent Food Delivery Time Prediction System
**Predict Smarter. Deliver Faster.**

## 1. Introduction
DeliverIQ is a machine-learning project that predicts food delivery time (minutes) from the Zomato delivery dataset and presents everything in a Streamlit app.

## 2. Problem Statement
Customers and restaurants need reliable delivery-time estimates. Delivery time depends on distance, traffic, weather, courier details and workload, so a data-driven regression model is used.

## 3. Objectives
- Clean the dataset and engineer useful features without target leakage.
- Explore the data visually.
- Compare 4 regression models and save the best.
- Group deliveries with K-Means.
- Provide an interactive prediction app.

## 4. Dataset
`data/Zomato_Dataset.csv` (original, never modified): 45,584 rows × 20 columns. **Target:** `Time_taken (min)` (10–54 min, mean 26.3).
Features: courier age/rating, restaurant & delivery GPS, order date/time, pickup time, weather, traffic, vehicle condition/type, order type, multiple deliveries, festival, city type. A cleaned copy is saved as `data/cleaned_data.csv` (41,944 rows).

## 5. Technologies
Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Streamlit, Joblib.

## 6. Algorithms
Linear Regression, Decision Tree (max_depth=8), Random Forest (100 trees), Gradient Boosting (150 trees, depth 4), and K-Means (k chosen by silhouette; elbow plot also shown).

## 7. Preprocessing
- No duplicates found. 431/162 negative restaurant lat/lon values were sign errors → made positive.
- 3,640 rows with placeholder/invalid GPS (≈0 or outside India) dropped.
- 46 ratings > 5 and 35 ages < 18 treated as missing.
- Missing values imputed **inside the pipeline** (median for numbers, most frequent for categories) so test data never influences training.
- Time columns came in mixed formats (`HH:MM`, `24:05:00`, Excel fractions like `0.8333`); all parsed.
- Engineered: `distance_km` (Haversine), `prep_time_min` (pickup − order time), `pickup_hour`, `day_of_week`, `is_weekend`.
- Scaling + one-hot encoding in a single scikit-learn `ColumnTransformer`.
- **Leakage control:** only information available at pickup is used; IDs, dates and raw coordinates are excluded; the 80/20 split happens before any fitting.

## 8. Model Evaluation & Results (20% test set, random_state=42)
| Model | MAE | MSE | RMSE | R² |
|---|---|---|---|---|
| **Random Forest** | **3.15** | **15.64** | **3.95** | **0.823** |
| Gradient Boosting | 3.33 | 17.31 | 4.16 | 0.804 |
| Decision Tree | 3.76 | 22.73 | 4.77 | 0.742 |
| Linear Regression | 4.84 | 37.03 | 6.09 | 0.580 |

Best model: **Random Forest** (typical error ≈ 3 minutes). Its train R² (0.91) is higher than test R² (0.82), i.e. mild overfitting.

**EDA findings:** mean delivery time by traffic: Low 21.3, Medium 26.7, High 27.2, Jam 31.2 min. Sunny weather is fastest (21.9) vs Fog/Cloudy (~29). More simultaneous deliveries means much longer times (0→22.9, 3→47.9 min). Festival days average 45.5 vs 26.0 min. Distance correlates moderately with time (0.32); higher-rated couriers are faster (−0.34).

**Clustering:** K-Means gave k=2 (silhouette 0.25): a "short, light" group (~8 km, 0.6 extra deliveries, 21.8 min) and a "long, busy" group (~13.5 km, 1.1 extra deliveries, 36.8 min).

## 9. Installation (Windows)
```
cd DeliverIQ
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## 10. Execution

### Option A: Complete Full-Stack Web Platform (React + FastAPI + ML)
Start both servers with one command:
```cmd
start.bat
```
Or in PowerShell:
```powershell
.\start.ps1
```
Or start manually in separate terminals:
1. **FastAPI ML Backend & Orders API:**
   ```powershell
   venv\Scripts\uvicorn.exe api:app --reload --port 8000
   ```
   Interactive Swagger docs: http://localhost:8000/docs
2. **React + Vite Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```
   Web App: http://localhost:5173

### Option B: Streamlit ML Analytics Studio (Original)
```powershell
venv\Scripts\streamlit.exe run app.py
```
Opens at http://localhost:8501.

`train_model.py` and `eda.py` regenerate all models/plots in `models/` and `reports/`.

## 11. Cloud Deployment (100% Free Architecture)

DeliverIQ utilizes a decoupled architecture designed to keep hosting completely **free** without performance penalties or truncated models:

| Component | Platform | Plan | Purpose |
|---|---|---|---|
| **Frontend UI** | **Vercel** | Free Hobby | React 19 + Vite SPA, edge CDN distribution |
| **Backend & ML** | **Hugging Face Spaces** or **Render** | 100% Free Tier | FastAPI, Random Forest inference (48.6 MB model), SQLite orders |

### 1. Deploy Frontend on Vercel
1. Import repository `https://github.com/arpitaghetiya/DeliverIQ` into Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: Your deployed FastAPI backend URL (e.g. `https://<your-backend>.hf.space` or `https://<your-backend>.onrender.com`).
5. Deploy.

### 2. Deploy Backend & ML Model
- **Hugging Face Spaces (Recommended for ML):**
  1. Create a new Space on Hugging Face (SDK: **Docker**, Free Tier: **2 vCPU, 16 GB RAM**).
  2. Push the backend code (`api.py`, `predict.py`, `data_preprocessing.py`, `models/`, `Dockerfile`, `requirements-prod.txt`).
  3. The API will automatically launch on public HTTPS: `https://<username>-deliveriq-api.hf.space`.
- **Render.com Web Service:**
  1. Connect GitHub repository and select **Web Service** (Free tier).
  2. Set Build Command: `pip install -r requirements-prod.txt`.
  3. Set Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`.

## 12. Limitations
- The dataset appears partly synthetic: some effects are unusual (e.g. "Semi-Urban" averages 49.7 min; "Urban" is fastest), so predictions can be non-intuitive and should not be treated as real-world guarantees.
- Prep time and pickup hour are missing for some orders (imputed).
- Only default parameters were used; no hyperparameter tuning or cross-validation.
- Single dataset, 44 days of data, India only.

## 12. Future Scope
Hyperparameter tuning and cross-validation, XGBoost/LightGBM, live traffic/weather APIs, route-based distance, React frontend + FastAPI backend, database logging, model monitoring.

## Viva questions
See `VIVA_QUESTIONS.md`.
