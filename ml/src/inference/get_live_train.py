import requests
import pandas as pd
from xgboost import XGBRegressor

from dotenv import load_dotenv
import os

load_dotenv()

API_KEY = os.getenv("RAILRADAR_API_KEY")

TRAIN_NUMBER = input("Enter train number: ").strip()


url = f"https://api.railradar.in/v1/trains/{TRAIN_NUMBER}/live"

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

response = requests.get(url, headers=headers)

if response.status_code != 200:
    print("API error:", response.status_code)
    print(response.text)
    exit()

data = response.json()["data"]


current = data["currentLocation"]
next_halt = data["nextHalt"]

current_station = current["stationCode"]
next_station = next_halt["stationCode"]

current_delay = data["delayMinutes"]


route = data["route"]

current_route = next(
    station for station in route
    if station["stationCode"] == current_station
)

next_route = next(
    station for station in route
    if station["stationCode"] == next_station
)


distance_to_next = (
    next_route["distance"] -
    current_route["distance"]
)
segment_progress = current.get("segmentProgress", 0)

remaining_distance = (
    distance_to_next * (1 - segment_progress)
)

current_departure = pd.to_datetime(
    current_route["scheduledDeparture"]
)

next_arrival = pd.to_datetime(
    next_route["scheduledArrival"]
)

scheduled_travel_minutes = (
    next_arrival - current_departure
).total_seconds() / 60


model = XGBRegressor()

model.load_model("../SIH2026/Prototype final/train_eta_proto.json")


input_data = pd.DataFrame([{
    "current_delay": current_delay,
    "distance_to_next": distance_to_next,
    "scheduled_travel_minutes": scheduled_travel_minutes
}])


predicted_delay = model.predict(input_data)[0]


additional_delay = predicted_delay - current_delay

predicted_travel_minutes = (
    scheduled_travel_minutes + additional_delay
)


print("\n==============================")
print("TRAIN ETA PREDICTION")
print("==============================")

print(f"Train:                       {data['trainNumber']}")
print(f"Name:                        {data['trainName']}")

print(f"\nCurrent station:             {current_station}")
print(f"Next station:                {next_station}")

print(f"\nCurrent delay:               {current_delay:.1f} min")
print(f"Distance to next:            {remaining_distance:.1f} km")
print(f"Scheduled travel time:       {scheduled_travel_minutes:.1f} min")

print(f"\nPredicted delay at {next_station}: {predicted_delay:.1f} min")
print(f"Delay change on segment:     {additional_delay:+.1f} min")
print(f"Predicted travel time:       {predicted_travel_minutes:.1f} min")