import pandas as pd

df = pd.read_csv("../SIH2026/Prototype final/teammate_data.csv")

df = df.sort_values(
    ["train_number", "journey_date", "distance_from_source_km"]
)

training_rows = []

for (train_number, journey_date), journey in df.groupby(
    ["train_number", "journey_date"]
):
    journey = journey.reset_index(drop=True)

    for i in range(len(journey) - 1):
        current = journey.iloc[i]
        next_station = journey.iloc[i + 1]

        if pd.isna(current["departure_delay_minutes"]):
            continue

        if pd.isna(next_station["arrival_delay_minutes"]):
            continue

        current_departure = pd.to_datetime(
            current["scheduled_departure"]
        )
        next_arrival = pd.to_datetime(
            next_station["scheduled_arrival"]
        )

        scheduled_travel_minutes = (
            next_arrival - current_departure
        ).total_seconds() / 60


        if scheduled_travel_minutes <= 0:
            continue

        training_rows.append({
            "train_number": current["train_number"],
            "train_name": current["train_name"],
            "journey_date": current["journey_date"],
            "day_of_week": current["day_of_week"],

            "source_station": current["source_station"],
            "destination_station": current["destination_station"],

            "current_station": current["station_code"],
            "next_station": next_station["station_code"],

            "current_delay": current["departure_delay_minutes"],

            "distance_to_next": (
                next_station["distance_from_source_km"]
                - current["distance_from_source_km"]
            ),

            "scheduled_travel_minutes": scheduled_travel_minutes,

            "target_delay": next_station["arrival_delay_minutes"]
        })


training_df = pd.DataFrame(training_rows)

print("\n==============================")
print("PREPROCESSING COMPLETE")
print("==============================")

print("\nTraining examples:", len(training_df))
print("Columns:", len(training_df.columns))

print("\nPreview:")
print(training_df.head(10).to_string(index=False))

print("\nSaved as: training_data_proto.csv")

training_df.to_csv(
    "training_data_proto.csv",
    index=False
)