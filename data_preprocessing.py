"""Data loading, cleaning and feature engineering for DeliverIQ."""
from pathlib import Path
import numpy as np
import pandas as pd

BASE = Path(__file__).parent
RAW_PATH = BASE / "data" / "Zomato_Dataset.csv"
CLEAN_PATH = BASE / "data" / "cleaned_data.csv"
TARGET = "Time_taken (min)"

NUM_FEATURES = ["Delivery_person_Age", "Delivery_person_Ratings", "distance_km",
                "Vehicle_condition", "multiple_deliveries", "prep_time_min",
                "pickup_hour", "day_of_week", "is_weekend"]
CAT_FEATURES = ["Weather_conditions", "Road_traffic_density", "Type_of_order",
                "Type_of_vehicle", "Festival", "City"]
FEATURES = NUM_FEATURES + CAT_FEATURES


def haversine(lat1, lon1, lat2, lon2):
    """Great-circle distance in km."""
    lat1, lon1, lat2, lon2 = map(np.radians, (lat1, lon1, lat2, lon2))
    a = np.sin((lat2 - lat1) / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin((lon2 - lon1) / 2) ** 2
    return 6371 * 2 * np.arcsin(np.sqrt(a))


def time_to_minutes(s):
    """Parse mixed time formats to minutes since midnight: 'HH:MM', 'HH:MM:SS' (incl. 24:xx),
    and Excel-style day fractions such as 0.8333 (= 20:00)."""
    s = s.astype("string").str.strip()
    out = pd.Series(np.nan, index=s.index, dtype="float64")
    num = pd.to_numeric(s, errors="coerce")
    frac = num.notna()
    out[frac] = (num[frac] * 1440).round() % 1440   # 1.0 -> 00:00
    hm = s.str.extract(r"^(\d{1,2}):(\d{2})(?::\d{2})?$").astype(float)
    ok = hm[0].notna()
    out[ok] = (hm.loc[ok, 0] * 60 + hm.loc[ok, 1]) % 1440
    return out


def load_raw(path=RAW_PATH):
    """Load the original dataset (never modified)."""
    return pd.read_csv(path)


def clean_data(raw):
    """Clean + engineer features. Returns (clean_df, log dict). Raw data is untouched."""
    df = raw.copy()
    log = {"raw_rows": len(df), "duplicates": int(df.duplicated().sum())}
    df = df.drop_duplicates()
    for c in df.select_dtypes(include=["object", "string"]).columns:
        df[c] = df[c].str.strip()

    # GPS: restaurant coordinates with a negative sign are sign errors -> abs();
    # zero / near-zero coordinates are placeholders -> drop; keep only India bounds.
    for c in ["Restaurant_latitude", "Restaurant_longitude"]:
        log[f"negative_{c}_fixed"] = int((df[c] < 0).sum())
        df[c] = df[c].abs()
    n = len(df)
    in_india = lambda lat, lon: lat.between(6, 38) & lon.between(68, 98)
    ok = in_india(df.Restaurant_latitude, df.Restaurant_longitude) & \
         in_india(df.Delivery_location_latitude, df.Delivery_location_longitude)
    df = df[ok].copy()
    log["invalid_gps_rows_dropped"] = n - len(df)

    # Impossible values -> missing (imputed later inside the pipeline)
    log["rating_gt5_set_nan"] = int((df.Delivery_person_Ratings > 5).sum())
    df.loc[df.Delivery_person_Ratings > 5, "Delivery_person_Ratings"] = np.nan
    log["age_lt18_set_nan"] = int((df.Delivery_person_Age < 18).sum())
    df.loc[df.Delivery_person_Age < 18, "Delivery_person_Age"] = np.nan

    # Feature engineering
    df["distance_km"] = haversine(df.Restaurant_latitude, df.Restaurant_longitude,
                                  df.Delivery_location_latitude, df.Delivery_location_longitude)
    date = pd.to_datetime(df.Order_Date, format="%d-%m-%Y", errors="coerce")
    picked, ordered = time_to_minutes(df.Time_Order_picked), time_to_minutes(df.Time_Orderd)
    prep = picked - ordered
    prep = prep.where(prep.isna() | (prep >= 0), prep + 1440)   # order placed before midnight
    df["prep_time_min"] = prep                          # NaN if order time missing
    df["pickup_hour"] = (picked // 60)
    df["day_of_week"] = date.dt.dayofweek
    df["is_weekend"] = (df.day_of_week >= 5).astype(int)

    # Leakage control: target is Time_taken (pickup -> delivery). Only information known
    # at pickup time is used. IDs, dates and raw coordinates are not model features.
    log["missing_before_imputation"] = {k: int(v) for k, v in df[FEATURES].isna().sum().items() if v}
    log["clean_rows"] = len(df)
    return df.reset_index(drop=True), log


def get_clean_data(save=True):
    clean, log = clean_data(load_raw())
    if save:
        clean.to_csv(CLEAN_PATH, index=False)
    return clean, log


if __name__ == "__main__":
    clean, log = get_clean_data()
    for k, v in log.items():
        print(f"{k}: {v}")
    print(clean[FEATURES + [TARGET]].describe().T.to_string())
