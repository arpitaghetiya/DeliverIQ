# DeliverIQ — 25 Viva Questions & Answers

1. **What is the aim of the project?** To predict food delivery time in minutes from order, courier, traffic and weather details.
2. **Is this regression or classification?** Regression, because the target (`Time_taken (min)`) is a continuous number.
3. **What is the target column?** `Time_taken (min)`.
4. **How big is the dataset?** 45,584 rows and 20 columns; 41,944 rows remain after cleaning.
5. **How did you handle missing values?** Median for numeric columns and most-frequent for categorical ones, inside the pipeline so there is no leakage from the test set.
6. **What was wrong with the GPS data?** Some restaurant coordinates were negative (sign errors, fixed with abs()) and some were ≈0 or outside India (3,640 rows dropped).
7. **How is distance calculated?** With the Haversine formula, which gives great-circle distance (km) from latitude/longitude.
8. **What is target leakage?** Using information in training that would not be available at prediction time. We avoided it by using only pickup-time information and excluding IDs and dates.
9. **Why split data before preprocessing?** So the imputer/scaler learn only from training data and test results stay honest.
10. **Which split did you use?** 80% training, 20% testing, random_state=42.
11. **Why one-hot encoding?** Models need numbers; one-hot turns categories like Weather into 0/1 columns without implying order.
12. **Why scaling?** Linear Regression works better with features on similar scales; it does not hurt tree models.
13. **What is MAE?** Mean Absolute Error: the average size of the prediction error, in minutes.
14. **What is MSE and RMSE?** MSE is the mean of squared errors; RMSE is its square root, in minutes, and penalises large errors more.
15. **What is R²?** The fraction of variance in delivery time explained by the model (1 is perfect).
16. **Which model was best?** Random Forest: MAE 3.15, RMSE 3.95, R² 0.823.
17. **Why was Linear Regression the worst?** Delivery time depends on non-linear interactions (e.g. traffic × distance), which a straight-line model cannot capture (R² 0.58).
18. **How does Random Forest work?** It trains many decision trees on random samples/features and averages their predictions, reducing variance.
19. **How does Gradient Boosting differ?** It builds trees one after another, each correcting the errors of the previous ones.
20. **Is there overfitting?** Slightly for Random Forest (train R² 0.91 vs test R² 0.82); the gap is moderate, and the test score is still the best.
21. **What is the most important feature?** Courier rating, followed by multiple deliveries, distance and traffic (see feature-importance chart).
22. **What is K-Means?** An unsupervised algorithm that groups similar records around k centroids by minimising within-cluster distance.
23. **How did you choose k?** Elbow method (inertia) and silhouette score; the best silhouette (0.25) was at k=2.
24. **What did the clusters show?** A short/light group (~8 km, ~21.8 min) and a long/busy group (~13.5 km, ~36.8 min).
25. **How does the app predict?** It collects inputs, builds the same features, and calls the saved Random Forest pipeline (`models/best_model.joblib`) via `predict.py`; nothing is hardcoded.
