"""Train + compare 4 regressors, save best pipeline; run K-Means clustering."""
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, silhouette_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.tree import DecisionTreeRegressor
from data_preprocessing import BASE, CAT_FEATURES, FEATURES, NUM_FEATURES, TARGET, get_clean_data

MODELS, REPORTS = BASE / "models", BASE / "reports"
SEED = 42


def make_preprocessor():
    num = Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())])
    cat = Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                    ("oh", OneHotEncoder(handle_unknown="ignore"))])
    return ColumnTransformer([("num", num, NUM_FEATURES), ("cat", cat, CAT_FEATURES)])


def train_regression(df):
    X, y = df[FEATURES], df[TARGET]
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=SEED)  # split BEFORE fitting preprocessing
    algos = {
        "Linear Regression": LinearRegression(),
        "Decision Tree": DecisionTreeRegressor(max_depth=8, min_samples_leaf=20, random_state=SEED),
        "Random Forest": RandomForestRegressor(n_estimators=100, min_samples_leaf=5, n_jobs=-1, random_state=SEED),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=150, max_depth=4, random_state=SEED),
    }
    rows, fitted = [], {}
    for name, est in algos.items():
        pipe = Pipeline([("prep", make_preprocessor()), ("model", est)]).fit(X_tr, y_tr)
        p = pipe.predict(X_te)
        mse = mean_squared_error(y_te, p)
        rows.append({"Model": name, "MAE": mean_absolute_error(y_te, p), "MSE": mse,
                     "RMSE": np.sqrt(mse), "R2": r2_score(y_te, p),
                     "Train R2": r2_score(y_tr, pipe.predict(X_tr))})
        fitted[name] = (pipe, p)
        print(f"trained {name}")
    res = pd.DataFrame(rows).sort_values("RMSE").reset_index(drop=True).round(4)
    best = res.loc[0, "Model"]
    pipe, pred = fitted[best]
    joblib.dump(pipe, MODELS / "best_model.joblib")
    res.to_csv(REPORTS / "model_comparison.csv", index=False)

    # Plots: metric comparison, actual vs predicted, feature importance
    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    res.set_index("Model")[["MAE", "RMSE"]].plot.bar(ax=ax[0], rot=20, color=["#4C72B0", "#DD8452"])
    ax[0].set_title("Error comparison (lower is better)")
    ax[1].scatter(y_te, pred, s=4, alpha=.3)
    ax[1].plot([10, 54], [10, 54], "r--"); ax[1].set(xlabel="Actual (min)", ylabel="Predicted (min)", title=f"{best}: actual vs predicted")
    plt.tight_layout(); plt.savefig(REPORTS / "model_performance.png", dpi=110); plt.close()

    model = pipe.named_steps["model"]
    names = pipe.named_steps["prep"].get_feature_names_out()
    imp = getattr(model, "feature_importances_", None)
    if imp is None:
        imp = np.abs(model.coef_)
    s = pd.Series(imp, index=[n.split("__", 1)[1] for n in names]).sort_values(ascending=False).head(12)
    s.to_csv(REPORTS / "feature_importance.csv", header=["importance"])
    plt.figure(figsize=(7, 4)); s[::-1].plot.barh(color="#55A868"); plt.title(f"Top features ({best})")
    plt.tight_layout(); plt.savefig(REPORTS / "feature_importance.png", dpi=110); plt.close()
    return res, best, X_tr


def run_clustering(df):
    cols = ["distance_km", "prep_time_min", "multiple_deliveries", "Delivery_person_Ratings", TARGET]
    d = df[cols].dropna()
    scaler = StandardScaler().fit(d)
    Z = scaler.transform(d)
    ks, inertia, sil = range(2, 9), [], []
    samp = np.random.RandomState(SEED).choice(len(Z), 5000, replace=False)
    for k in ks:
        km = KMeans(n_clusters=k, n_init=5, random_state=SEED).fit(Z)
        inertia.append(km.inertia_); sil.append(silhouette_score(Z[samp], km.labels_[samp]))
    k_best = list(ks)[int(np.argmax(sil))]
    km = KMeans(n_clusters=k_best, n_init=10, random_state=SEED).fit(Z)
    d = d.assign(Cluster=km.labels_)
    summary = d.groupby("Cluster").agg(Orders=(TARGET, "size"), Avg_Distance_km=("distance_km", "mean"),
                                       Avg_Prep_min=("prep_time_min", "mean"), Avg_Multi_Deliveries=("multiple_deliveries", "mean"),
                                       Avg_Rating=("Delivery_person_Ratings", "mean"), Avg_Delivery_min=(TARGET, "mean")).round(2)
    summary.to_csv(REPORTS / "cluster_summary.csv")
    joblib.dump({"kmeans": km, "scaler": scaler, "cols": cols}, MODELS / "kmeans.joblib")

    fig, ax = plt.subplots(1, 2, figsize=(11, 4))
    ax[0].plot(list(ks), inertia, "o-"); ax[0].set(xlabel="k", ylabel="Inertia", title="Elbow method")
    ax[1].plot(list(ks), sil, "o-", c="g"); ax[1].axvline(k_best, ls="--", c="r"); ax[1].set(xlabel="k", ylabel="Silhouette", title=f"Silhouette score (best k={k_best})")
    plt.tight_layout(); plt.savefig(REPORTS / "elbow_silhouette.png", dpi=110); plt.close()
    plt.figure(figsize=(7, 5))
    s = d.sample(5000, random_state=SEED)
    sns.scatterplot(data=s, x="distance_km", y=TARGET, hue="Cluster", palette="tab10", s=12, alpha=.6)
    plt.title("K-Means clusters: distance vs delivery time"); plt.tight_layout()
    plt.savefig(REPORTS / "clusters.png", dpi=110); plt.close()
    return k_best, float(max(sil))


if __name__ == "__main__":
    df, _ = get_clean_data()
    res, best, X_tr = train_regression(df)
    print(res.to_string(index=False)); print("BEST:", best)
    k, sil = run_clustering(df)
    print(f"K-Means k={k}, silhouette={sil:.3f}")
    meta = {"best_model": best, "n_rows": len(df), "features": FEATURES,
            "categories": {c: sorted(df[c].dropna().unique().tolist()) for c in CAT_FEATURES},
            "k_clusters": k, "silhouette": sil}
    json.dump(meta, open(MODELS / "metadata.json", "w"), indent=2)
