import asyncio
from datetime import datetime

from app.services.train_service import train_prediction_service
from app.services.eta_service import calculate_eta_details
from app.websocket.manager import connection_manager


async def simulate_train_updates(train_number: str, train_data: dict):

    while True:

        current_delay = train_data["delay_minutes"] + 1
        train_data["delay_minutes"] = current_delay

        predicted_delay = train_prediction_service.predict_future_delay(
            current_delay=current_delay,
            distance_to_next=train_data["distance_to_next"],
            scheduled_travel_minutes=train_data["scheduled_travel_minutes"],
        )

        scheduled_arrival = datetime.fromisoformat(
            train_data["scheduled_arrival"]
        )

        eta_details = calculate_eta_details(
            scheduled_arrival=scheduled_arrival,
            current_delay_minutes=current_delay,
            predicted_delay_minutes=predicted_delay,
        )

        message = {
            "train_number": train_data["train_number"],
            "current_delay_minutes": current_delay,
            "predicted_delay_minutes": predicted_delay,
            "delay_change_minutes": eta_details["delay_change_minutes"],
            "predicted_eta": eta_details["predicted_eta"].isoformat(),
        }

        await connection_manager.send_to_train(
            train_number,
            message,
        )

        await asyncio.sleep(10)