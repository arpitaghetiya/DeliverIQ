"""DeliverIQ - Streamlit app. Run: streamlit run app.py"""
import json
import joblib
import pandas as pd
import streamlit as st
from data_preprocessing import BASE, TARGET, FEATURES, get_clean_data, load_raw
from predict import predict_delivery_time

R, M = BASE / "reports", BASE / "models"
st.set_page_config(page_title="DeliverIQ", page_icon="🛵", layout="wide")


@st.cache_data
def data():
    clean, log = get_clean_data(save=False)
    return load_raw(), clean, log


@st.cache_data
def meta():
    return json.load(open(M / "metadata.json"))


def img(name, caption=None):
    st.image(str(R / name), caption=caption, width="stretch")


raw, clean, log = data()
meta = meta()
st.sidebar.title("🛵 DeliverIQ")
st.sidebar.caption("Predict Smarter. Deliver Faster.")
page = st.sidebar.radio("Navigate", ["Home", "Dataset Overview", "Exploratory Data Analysis",
                                     "Model Performance", "Delivery Time Prediction", "Clustering Analysis"])

if page == "Home":
    st.title("🛵 DeliverIQ")
    st.subheader("Intelligent Food Delivery Time Prediction System")
    st.markdown("**Predict Smarter. Deliver Faster.**")
    st.write("DeliverIQ predicts how many minutes a food order will take to be delivered (after pickup), "
             "using the Zomato delivery dataset and four regression models, plus K-Means clustering of delivery profiles.")
    res = pd.read_csv(R / "model_comparison.csv")
    c = st.columns(4)
    c[0].metric("Orders used", f"{len(clean):,}")
    c[1].metric("Best model", meta["best_model"])
    c[2].metric("Test R²", f"{res.loc[0, 'R2']:.3f}")
    c[3].metric("Test MAE", f"{res.loc[0, 'MAE']:.2f} min")
    st.info("Use the sidebar to explore the data, compare models, and make live predictions.")

elif page == "Dataset Overview":
    st.header("Dataset Overview")
    c = st.columns(3)
    c[0].metric("Raw rows", f"{len(raw):,}"); c[1].metric("Columns", raw.shape[1]); c[2].metric("Clean rows", f"{len(clean):,}")
    st.subheader("Raw data sample"); st.dataframe(raw.head(20), width="stretch")
    st.subheader("Missing values (raw)")
    mv = raw.isna().sum(); st.dataframe(mv[mv > 0].rename("missing").to_frame())
    st.subheader("Cleaning log"); st.json(log)
    st.subheader("Summary statistics (clean)"); st.dataframe(clean[FEATURES + [TARGET]].describe().T, width="stretch")

elif page == "Exploratory Data Analysis":
    st.header("Exploratory Data Analysis")
    st.markdown((R / "eda_findings.md").read_text(encoding="utf-8"))
    for f, t in [("eda_distribution.png", "Delivery time distribution"), ("eda_traffic.png", "Traffic"), ("eda_weather.png", "Weather"),
                 ("eda_distance.png", "Distance"), ("eda_ratings.png", "Ratings"), ("eda_heatmap.png", "Correlation heatmap"),
                 ("eda_relationships.png", "Other relationships")]:
        st.subheader(t); img(f)

elif page == "Model Performance":
    st.header("Model Performance")
    res = pd.read_csv(R / "model_comparison.csv")
    st.dataframe(res.style.highlight_min(subset=["MAE", "MSE", "RMSE"], color="#c6efce").highlight_max(subset=["R2"], color="#c6efce"), width="stretch")
    st.success(f"Best model (lowest test RMSE): **{meta['best_model']}**")
    img("model_performance.png"); img("feature_importance.png")

elif page == "Delivery Time Prediction":
    st.header("Delivery Time Prediction")
    cat = meta["categories"]
    with st.form("f"):
        a, b, c = st.columns(3)
        dist = a.slider("Distance (km)", 1.0, 25.0, 8.0, 0.5)
        age = a.slider("Delivery partner age", 18, 55, 29)
        rating = a.slider("Partner rating", 1.0, 5.0, 4.7, 0.1)
        prep = a.slider("Food preparation time (min)", 0, 30, 10)
        traffic = b.selectbox("Traffic", ["Low", "Medium", "High", "Jam"], index=2)
        weather = b.selectbox("Weather", cat["Weather_conditions"])
        city = b.selectbox("City type", cat["City"])
        festival = b.selectbox("Festival", cat["Festival"])
        order = c.selectbox("Order type", cat["Type_of_order"])
        vehicle = c.selectbox("Vehicle", cat["Type_of_vehicle"])
        vcond = c.slider("Vehicle condition (0 worst-3 best)", 0, 3, 1)
        multi = c.slider("Other deliveries on the trip", 0, 3, 0)
        hour = b.slider("Pickup hour (0-23)", 0, 23, 19)
        day = c.selectbox("Day of week", ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
        go = st.form_submit_button("Predict delivery time")
    if go:
        d = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].index(day)
        x = {"Delivery_person_Age": age, "Delivery_person_Ratings": rating, "distance_km": dist, "Vehicle_condition": vcond,
             "multiple_deliveries": multi, "prep_time_min": prep, "pickup_hour": hour, "day_of_week": d, "is_weekend": int(d >= 5),
             "Weather_conditions": weather, "Road_traffic_density": traffic, "Type_of_order": order,
             "Type_of_vehicle": vehicle, "Festival": festival, "City": city}
        p = predict_delivery_time(x)
        st.metric("Predicted delivery time", f"{p:.1f} minutes")
        mae = pd.read_csv(R / "model_comparison.csv").loc[0, "MAE"]
        st.caption(f"Typical error of the model on test data: ±{mae:.1f} min (MAE). Prediction from the saved {meta['best_model']} pipeline.")

else:
    st.header("Clustering Analysis (K-Means)")
    st.write(f"Orders are grouped by distance, prep time, multiple deliveries, partner rating and delivery time. "
             f"Best k by silhouette score: **{meta['k_clusters']}** (score {meta['silhouette']:.3f}).")
    img("elbow_silhouette.png"); img("clusters.png")
    cs = pd.read_csv(R / "cluster_summary.csv"); st.dataframe(cs, width="stretch")
    slow = cs.loc[cs.Avg_Delivery_min.idxmax()]
    st.markdown(f"- **Cluster {int(slow.Cluster)}** = long/slow deliveries: avg {slow.Avg_Distance_km} km, {slow.Avg_Multi_Deliveries} extra deliveries, "
                f"rating {slow.Avg_Rating}, {slow.Avg_Delivery_min} min.\n"
                f"- The other cluster(s) are shorter, quicker orders with fewer combined deliveries.")
