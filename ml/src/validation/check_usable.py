import pandas as pd

df = pd.read_csv("../SIH2026/Prototype final/teammate_data.csv")

df = df.sort_values(
    ["train_number", "journey_date", "distance_from_source_km"]
)

usable = 0
total = 0

for _, journey in df.groupby(["train_number", "journey_date"]):
    journey = journey.reset_index(drop=True)

    total += len(journey) - 1

    for i in range(len(journey) - 1):
        current = journey.iloc[i]
        next_station = journey.iloc[i + 1]

        if (
            pd.notna(current["departure_delay_minutes"])
            and pd.notna(next_station["arrival_delay_minutes"])
        ):
            usable += 1

print("Possible transitions:", total)
print("Usable training examples:", usable)