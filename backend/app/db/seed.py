from app.db.database import SessionLocal
from app.db.models import Zone, Station, Train, Route, RouteStation


def seed_database():
    db = SessionLocal()

    try:
        # Zone
        zone = Zone(
            zone_code="NR",
            zone_name="Northern Railway"
        )
        db.add(zone)
        db.flush()

        # Stations
        ludhiana = Station(
            station_code="LDH",
            station_name="Ludhiana Junction",
            latitude=30.9010,
            longitude=75.8573,
            zone_id=zone.id
        )

        jalandhar = Station(
            station_code="JUC",
            station_name="Jalandhar City",
            latitude=31.3260,
            longitude=75.5762,
            zone_id=zone.id
        )

        phagwara = Station(
            station_code="PGW",
            station_name="Phagwara Junction",
            latitude=31.2240,
            longitude=75.7708,
            zone_id=zone.id
        )

        beas = Station(
            station_code="BEAS",
            station_name="Beas Junction",
            latitude=31.5167,
            longitude=75.3000,
            zone_id=zone.id
        )

        amritsar = Station(
            station_code="ASR",
            station_name="Amritsar Junction",
            latitude=31.6339,
            longitude=74.8723,
            zone_id=zone.id
        )

        db.add_all([
            ludhiana,
            jalandhar,
            phagwara,
            beas,
            amritsar
        ])

        db.flush()

        # Trains
        train1 = Train(
            train_number="12345",
            train_name="Sample Express",
            train_type="Express"
        )

        train2 = Train(
            train_number="12459",
            train_name="New Delhi Express",
            train_type="Express"
        )

        db.add_all([train1, train2])
        db.flush()

        # Route
        route = Route(
            route_name="Ludhiana - Amritsar",
            source_station_id=ludhiana.id,
            destination_station_id=amritsar.id
        )

        db.add(route)
        db.flush()

        # Route station sequence
        route_stations = [
            RouteStation(
                route_id=route.id,
                station_id=ludhiana.id,
                sequence_number=1
            ),
            RouteStation(
                route_id=route.id,
                station_id=jalandhar.id,
                sequence_number=2
            ),
            RouteStation(
                route_id=route.id,
                station_id=phagwara.id,
                sequence_number=3
            ),
            RouteStation(
                route_id=route.id,
                station_id=beas.id,
                sequence_number=4
            ),
            RouteStation(
                route_id=route.id,
                station_id=amritsar.id,
                sequence_number=5
            )
        ]

        db.add_all(route_stations)

        db.commit()

        print("Database seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()