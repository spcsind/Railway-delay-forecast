from fastapi import APIRouter
from app.schemas.train import TrainStatus


router = APIRouter(
    prefix="/trains",
    tags=["Trains"]
)


@router.get("/demo", response_model=TrainStatus)
def get_demo_train():
    return {
        "train_number": "12345",
        "current_station": "Ludhiana",
        "next_station": "Jalandhar",
        "speed": 72.0,
        "delay_minutes": 8.0,
        "status": "RUNNING",
        "location": {
            "latitude": 30.9010,
            "longitude": 75.8573
        }
    }