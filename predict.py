"""Load the saved pipeline and predict delivery time (minutes)."""
import json
import joblib
import pandas as pd
from data_preprocessing import BASE, FEATURES

_model = None


def load_model():
    global _model
    if _model is None:
        _model = joblib.load(BASE / "models" / "best_model.joblib")
    return _model


def predict_delivery_time(inputs: dict) -> float:
    """inputs: dict with keys from data_preprocessing.FEATURES. Returns minutes."""
    row = pd.DataFrame([inputs]).reindex(columns=FEATURES)
    return float(load_model().predict(row)[0])


if __name__ == "__main__":
    sample = {"Delivery_person_Age": 28, "Delivery_person_Ratings": 4.6, "distance_km": 8.0, "Vehicle_condition": 1,
              "multiple_deliveries": 1, "prep_time_min": 10, "pickup_hour": 19, "day_of_week": 4, "is_weekend": 0,
              "Weather_conditions": "Sunny", "Road_traffic_density": "High", "Type_of_order": "Meal",
              "Type_of_vehicle": "motorcycle", "Festival": "No", "City": "Urban"}
    print(f"Predicted delivery time: {predict_delivery_time(sample):.1f} minutes")
    sample.update(Road_traffic_density="Low", Weather_conditions="Sunny", distance_km=3.0)
    print(f"Low traffic, 3 km: {predict_delivery_time(sample):.1f} minutes")
