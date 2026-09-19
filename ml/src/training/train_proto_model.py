import pandas as pd

from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error


df = pd.read_csv("training_data_proto.csv")


X = df[
    [
        "current_delay",
        "distance_to_next",
        "scheduled_travel_minutes"
    ]
]


y = df["target_delay"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


model = XGBRegressor(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.05,
    objective="reg:squarederror",
    random_state=42
)


model.fit(X_train, y_train)


predictions = model.predict(X_test)


mae = mean_absolute_error(y_test, predictions)
rmse = mean_squared_error(y_test, predictions) ** 0.5

print("\n==============================")
print("PROTOTYPE MODEL RESULTS")
print("==============================")

print(f"Total examples:   {len(df)}")
print(f"Training examples: {len(X_train)}")
print(f"Testing examples:  {len(X_test)}")

print(f"\nMAE:  {mae:.2f} minutes")
print(f"RMSE: {rmse:.2f} minutes")

print("\nSample predictions:")

results = pd.DataFrame({
    "Actual delay": y_test.values,
    "Predicted delay": predictions.round(2)
})

print(results.head(15).to_string(index=False))


model.save_model("train_eta_proto.json")

print("\nModel saved as: train_eta_proto.json")