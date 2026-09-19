from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.db.database import SessionLocal
from app.db.models import Train
from app.schemas.train import TrainPrediction
from app.services.eta_service import calculate_eta_details
from app.services.train_service import train_prediction_service


router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.get("/{train_number}", response_model=TrainPrediction)
def get_train_prediction(train_number: str):

    db = SessionLocal()

    try:
        train = (
            db.query(Train)
            .filter(Train.train_number == train_number)
            .first()
        )

    finally:
        db.close()

    if train is None:
        raise HTTPException(
            status_code=404,
            detail="Train not found"
        )

    # Prototype live values
    current_delay = 8.0
    distance_to_next = 28.0
    scheduled_travel_minutes = 19.0
    scheduled_arrival = datetime.fromisoformat(
        "2026-09-19T10:51:00"
    )

    predicted_delay = train_prediction_service.predict_future_delay(
        current_delay=current_delay,
        distance_to_next=distance_to_next,
        scheduled_travel_minutes=scheduled_travel_minutes,
    )

    eta_details = calculate_eta_details(
        scheduled_arrival=scheduled_arrival,
        current_delay_minutes=current_delay,
        predicted_delay_minutes=predicted_delay,
    )

    return {
        "train_number": train.train_number,
        "next_station": "Jalandhar",
        "current_delay_minutes": current_delay,
        "predicted_delay_minutes": predicted_delay,
        "delay_change_minutes": eta_details["delay_change_minutes"],
        "predicted_eta": eta_details["predicted_eta"],
        "lower_eta": None,
        "upper_eta": None,
        "model_version": "train_eta_proto_v1",
    }