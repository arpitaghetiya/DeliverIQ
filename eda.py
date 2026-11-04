"""Generate EDA plots and a findings file in reports/."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from data_preprocessing import BASE, NUM_FEATURES, TARGET, get_clean_data

R = BASE / "reports"
sns.set_theme(style="whitegrid")


def save(name):
    plt.tight_layout(); plt.savefig(R / name, dpi=110); plt.close()


def main():
    df, _ = get_clean_data()
    t = TARGET
    plt.figure(figsize=(7, 4)); sns.histplot(df[t], bins=40, kde=True, color="#4C72B0")
    plt.axvline(df[t].mean(), c="r", ls="--", label=f"mean {df[t].mean():.1f}"); plt.legend(); plt.title("Delivery time distribution"); plt.xlabel("Minutes"); save("eda_distribution.png")

    order = ["Low", "Medium", "High", "Jam"]
    plt.figure(figsize=(7, 4)); sns.boxplot(data=df, x="Road_traffic_density", y=t, order=order, palette="viridis", hue="Road_traffic_density", legend=False); plt.title("Traffic vs delivery time"); save("eda_traffic.png")

    w = df.groupby("Weather_conditions")[t].mean().sort_values().index
    plt.figure(figsize=(8, 4)); sns.boxplot(data=df, x="Weather_conditions", y=t, order=w, palette="mako", hue="Weather_conditions", legend=False); plt.title("Weather vs delivery time"); save("eda_weather.png")

    plt.figure(figsize=(7, 4)); s = df.sample(4000, random_state=1)
    sns.scatterplot(data=s, x="distance_km", y=t, s=8, alpha=.4); sns.regplot(data=s, x="distance_km", y=t, scatter=False, color="r"); plt.title("Distance vs delivery time"); save("eda_distance.png")

    plt.figure(figsize=(7, 4)); b = df.assign(r=pd.cut(df.Delivery_person_Ratings, [0, 4, 4.4, 4.7, 4.9, 5]))
    sns.barplot(data=b, x="r", y=t, errorbar=None, color="#DD8452"); plt.xlabel("Rating band"); plt.title("Ratings vs delivery time (mean)"); save("eda_ratings.png")

    num = df[[c for c in NUM_FEATURES if c != "is_weekend"] + [t]]
    plt.figure(figsize=(9, 7)); sns.heatmap(num.corr(), annot=True, fmt=".2f", cmap="coolwarm", center=0); plt.title("Correlation heatmap"); save("eda_heatmap.png")

    fig, ax = plt.subplots(1, 3, figsize=(14, 4))
    sns.barplot(data=df, x="multiple_deliveries", y=t, errorbar=None, ax=ax[0], color="#55A868")
    sns.barplot(data=df, x="Type_of_vehicle", y=t, errorbar=None, ax=ax[1], color="#C44E52"); ax[1].tick_params(axis="x", rotation=20)
    sns.barplot(data=df, x="City", y=t, errorbar=None, ax=ax[2], color="#8172B2")
    for a, n in zip(ax, ["Multiple deliveries", "Vehicle type", "City type"]): a.set_title(f"{n} vs delivery time")
    save("eda_relationships.png")

    m = lambda c: df.groupby(c)[t].mean().round(1).to_dict()
    corr = num.corr()[t].drop(t).sort_values(key=abs, ascending=False).round(2)
    out = [f"- Delivery time: mean {df[t].mean():.1f} min, median {df[t].median():.0f}, range {df[t].min()}-{df[t].max()} min (right-skewed, no extreme outliers).",
           f"- Traffic (mean min): {m('Road_traffic_density')}",
           f"- Weather (mean min): {m('Weather_conditions')}",
           f"- Distance correlation with time: {corr.get('distance_km')}; strongest numeric correlations: {corr.head(4).to_dict()}",
           f"- Multiple deliveries (mean min): {m('multiple_deliveries')}",
           f"- Vehicle (mean min): {m('Type_of_vehicle')}",
           f"- City type (mean min): {m('City')}",
           f"- Festival (mean min): {m('Festival')}"]
    (R / "eda_findings.md").write_text("\n".join(out), encoding="utf-8")
    print("\n".join(out))


if __name__ == "__main__":
    main()
