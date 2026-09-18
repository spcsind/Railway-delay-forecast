from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from app.schemas.train import TrainResponse, TrainStatus
from app.websocket.manager import connection_manager

router = APIRouter(
    prefix="/trains",
    tags=["Trains"]
)


# Temporary in-memory data.
# Later this will come from PostgreSQL / live data service.
TRAIN_DATA = {
    "12345": {
        "train_number": "12345",
        "train_name": "Sample Express",
        "current_station": "Ludhiana",
        "next_station": "Jalandhar",
        "speed": 72.0,
        "delay_minutes": 8.0,
        "status": "RUNNING",
        "location": {
            "latitude": 30.9010,
            "longitude": 75.8573
        },

        # Temporary prototype route data
        "distance_to_next": 28.0,
        "scheduled_travel_minutes": 19.0,
        "scheduled_arrival": "2026-09-19T10:51:00"
    },

    "12459": {
        "train_number": "12459",
        "train_name": "New Delhi Express",
        "current_station": "Ambala",
        "next_station": "Ludhiana",
        "speed": 81.0,
        "delay_minutes": 5.0,
        "status": "RUNNING",
        "location": {
            "latitude": 30.3782,
            "longitude": 76.7767
        },

        # Temporary prototype route data
        "distance_to_next": 199.0,
        "scheduled_travel_minutes": 141.0,
        "scheduled_arrival": "2026-09-19T11:15:00"
    }
}


@router.get("/", response_model=list[TrainStatus])
def get_trains():
    return list(TRAIN_DATA.values())


@router.get("/{train_number}", response_model=TrainStatus)
def get_train(train_number: str):

    train = TRAIN_DATA.get(train_number)

    if train is None:
        raise HTTPException(
            status_code=404,
            detail="Train not found"
        )

    return train

@router.websocket("/ws/{train_number}")
async def train_websocket(
    websocket: WebSocket,
    train_number: str,
):
    if train_number not in TRAIN_DATA:
        await websocket.close(code=1008)
        return

    await connection_manager.connect(
        train_number,
        websocket,
    )

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        connection_manager.disconnect(
            train_number,
            websocket,
        )