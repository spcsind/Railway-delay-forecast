from pydantic import BaseModel
from typing import Optional


class TrainLocation(BaseModel):
    latitude: float
    longitude: float


class TrainStatus(BaseModel):
    train_number: str
    current_station: Optional[str] = None
    next_station: Optional[str] = None
    speed: float
    delay_minutes: float
    status: str
    location: TrainLocation