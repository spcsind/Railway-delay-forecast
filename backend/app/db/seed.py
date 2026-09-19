from app.db.database import SessionLocal
from app.db.models import (
    Zone,
    Station,
    Train,
    Route,
    RouteStation,
)


def seed_database():

    db = SessionLocal()

    try:
        # ==========================================
        # 1. ZONE
        # ==========================================

        zone = (
            db.query(Zone)
            .filter(Zone.zone_code == "NR")
            .first()
        )

        if zone is None:
            zone = Zone(
                zone_code="NR",
                zone_name="Northern Railway"
            )
            db.add(zone)
            db.flush()

        print("Zone ready:", zone.zone_name)

        # ==========================================
        # 2. STATIONS
        # ==========================================

        stations_data = [
            {
                "code": "UMB",
                "name": "Ambala Cantt",
                "latitude": 30.3782,
                "longitude": 76.7767,
            },
            {
                "code": "LDH",
                "name": "Ludhiana Junction",
                "latitude": 30.9000,
                "longitude": 75.8573,
            },
            {
                "code": "JUC",
                "name": "Jalandhar City",
                "latitude": 31.3260,
                "longitude": 75.5762,
            },
            {
                "code": "PGW",
                "name": "Phagwara Junction",
                "latitude": 31.2240,
                "longitude": 75.7690,
            },
            {
                "code": "BEAS",
                "name": "Beas Junction",
                "latitude": 31.5397,
                "longitude": 75.2820,
            },
            {
                "code": "ASR",
                "name": "Amritsar Junction",
                "latitude": 31.6339,
                "longitude": 74.8723,
            },
        ]

        stations = {}

        for data in stations_data:

            station = (
                db.query(Station)
                .filter(
                    Station.station_code == data["code"]
                )
                .first()
            )

            if station is None:
                station = Station(
                    station_code=data["code"],
                    station_name=data["name"],
                    latitude=data["latitude"],
                    longitude=data["longitude"],
                    zone_id=zone.id,
                )

                db.add(station)
                db.flush()

            stations[data["code"]] = station

        print("Stations ready:", len(stations))

        # ==========================================
        # 3. TRAINS
        # ==========================================

        trains_data = [
            {
                "number": "12345",
                "name": "Sample Express",
                "type": "EXPRESS",
            },
            {
                "number": "12459",
                "name": "New Delhi Express",
                "type": "EXPRESS",
            },
            {
                "number": "14649",
                "name": "Intercity Express",
                "type": "EXPRESS",
            },
            {
                "number": "12925",
                "name": "Paschim Express",
                "type": "EXPRESS",
            },
        ]

        trains = {}

        for data in trains_data:

            train = (
                db.query(Train)
                .filter(
                    Train.train_number == data["number"]
                )
                .first()
            )

            if train is None:
                train = Train(
                    train_number=data["number"],
                    train_name=data["name"],
                    train_type=data["type"],
                )

                db.add(train)
                db.flush()

            trains[data["number"]] = train

        print("Trains ready:", len(trains))

        # ==========================================
        # 4. ROUTES
        # ==========================================

        routes_data = [
            {
                "name": "Ambala-Ludhiana-Jalandhar-Amritsar",
                "source": "UMB",
                "destination": "ASR",
                "stations": [
                    "UMB",
                    "LDH",
                    "JUC",
                    "BEAS",
                    "ASR",
                ],
            },
            {
                "name": "Ludhiana-Jalandhar-Phagwara-Beas-Amritsar",
                "source": "LDH",
                "destination": "ASR",
                "stations": [
                    "LDH",
                    "JUC",
                    "PGW",
                    "BEAS",
                    "ASR",
                ],
            },
        ]

        routes = {}

        for route_data in routes_data:

            route = (
                db.query(Route)
                .filter(
                    Route.route_name == route_data["name"]
                )
                .first()
            )

            if route is None:
                route = Route(
                    route_name=route_data["name"],
                    source_station_id=stations[
                        route_data["source"]
                    ].id,
                    destination_station_id=stations[
                        route_data["destination"]
                    ].id,
                )

                db.add(route)
                db.flush()

            routes[route_data["name"]] = route

            # ======================================
            # ROUTE STATIONS
            # ======================================

            for sequence, station_code in enumerate(
                route_data["stations"],
                start=1
            ):

                existing_route_station = (
                    db.query(RouteStation)
                    .filter(
                        RouteStation.route_id == route.id,
                        RouteStation.station_id
                        == stations[station_code].id,
                    )
                    .first()
                )

                if existing_route_station is None:

                    route_station = RouteStation(
                        route_id=route.id,
                        station_id=stations[station_code].id,
                        sequence_number=sequence,
                    )

                    db.add(route_station)

        db.commit()

        print("\n==============================")
        print("DATABASE SEED COMPLETE")
        print("==============================")

        print("\nTrains:")

        for train in trains.values():
            print(
                f"{train.train_number} - "
                f"{train.train_name}"
            )

        print("\nStations:")

        for station in stations.values():
            print(
                f"{station.station_code} - "
                f"{station.station_name}"
            )

    except Exception as e:

        db.rollback()

        print("\nDatabase seed failed:")
        print(e)

        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()