import pandas as pd
from xgboost import XGBRegressor

# Load trained model
model = XGBRegressor()
model.load_model("/Users/rishabhsyal/Uni/SIH2026/Prototype final/train_eta_proto.json")

# Example current train situation
current_delay = 10
distance_to_next = 28
scheduled_travel_minutes = 19

# Create input
input_data = pd.DataFrame([{
    "current_delay": current_delay,
    "distance_to_next": distance_to_next,
    "scheduled_travel_minutes": scheduled_travel_minutes
}])

# Predict next-station delay
predicted_delay = model.predict(input_data)[0]

# Calculate predicted travel time
predicted_travel_minutes = (
    scheduled_travel_minutes
    + predicted_delay
    - current_delay
)

print("\n==============================")
print("TRAIN ETA PREDICTION")
print("==============================")

print(f"Current delay:              {current_delay:.0f} min")
print(f"Distance to next station:   {distance_to_next:.0f} km")
print(f"Scheduled travel time:      {scheduled_travel_minutes:.0f} min")

print(f"\nPredicted next-station delay: {predicted_delay:.1f} min")
print(f"Predicted travel time:         {predicted_travel_minutes:.1f} min")