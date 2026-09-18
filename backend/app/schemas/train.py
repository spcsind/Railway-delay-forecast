from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TrainLocation(BaseModel):
    latitude: float
    longitude: float


class TrainStatus(BaseModel):
    train_number: str
    train_name: Optional[str] = None

    current_station: Optional[str] = None
    next_station: Optional[str] = None

    speed: Optional[float] = None
    delay_minutes: Optional[float] = None

    status: str = "UNKNOWN"

    location: Optional[TrainLocation] = None

    last_updated: Optional[datetime] = None


class TrainPrediction(BaseModel):
    train_number: str

    next_station: Optional[str] = None

    current_delay_minutes: Optional[float] = None
    predicted_delay_minutes: Optional[float] = None
    delay_change_minutes: Optional[float] = None

    predicted_eta: Optional[datetime] = None

    lower_eta: Optional[datetime] = None
    upper_eta: Optional[datetime] = None

    model_version: Optional[str] = None

class TrainResponse(BaseModel):
    train: TrainStatus
    prediction: Optional[TrainPrediction] = None