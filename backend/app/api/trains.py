import asyncio

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Train
from app.schemas.train import TrainStatus
from app.services.simulator import simulate_train_updates
from app.websocket.manager import connection_manager


router = APIRouter(
    prefix="/trains",
    tags=["Trains"]
)


# ==========================================
# TRAIN-SPECIFIC SIMULATION DATA
# ==========================================

TRAIN_SIMULATION_DATA = {

    "12345": {
        "delay_minutes": 8.0,
        "distance_to_next": 28.0,
        "scheduled_travel_minutes": 19.0,
        "scheduled_arrival": "2026-09-19T10:51:00",
    },

    "12459": {
        "delay_minutes": 5.0,
        "distance_to_next": 42.0,
        "scheduled_travel_minutes": 31.0,
        "scheduled_arrival": "2026-09-19T10:41:00",
    },

    "14649": {
        "delay_minutes": 12.0,
        "distance_to_next": 35.0,
        "scheduled_travel_minutes": 24.0,
        "scheduled_arrival": "2026-09-19T10:20:00",
    },

    "12925": {
        "delay_minutes": 3.0,
        "distance_to_next": 58.0,
        "scheduled_travel_minutes": 38.0,
        "scheduled_arrival": "2026-09-19T09:54:00",
    },
}


# ==========================================
# GET ALL TRAINS
# ==========================================

@router.get(
    "/",
    response_model=list[TrainStatus]
)
def get_trains():

    db: Session = SessionLocal()

    try:

        trains = db.query(Train).all()

        return [
            TrainStatus(
                train_number=train.train_number,
                train_name=train.train_name,
                status="RUNNING"
            )
            for train in trains
        ]

    finally:

        db.close()


# ==========================================
# GET SINGLE TRAIN
# ==========================================

@router.get(
    "/{train_number}",
    response_model=TrainStatus
)
def get_train(train_number: str):

    db: Session = SessionLocal()

    try:

        train = (
            db.query(Train)
            .filter(
                Train.train_number == train_number
            )
            .first()
        )

        if train is None:

            raise HTTPException(
                status_code=404,
                detail="Train not found"
            )

        return TrainStatus(
            train_number=train.train_number,
            train_name=train.train_name,
            status="RUNNING"
        )

    finally:

        db.close()


# ==========================================
# WEBSOCKET LIVE TRAIN UPDATES
# ==========================================

@router.websocket(
    "/ws/{train_number}"
)
async def train_websocket(
    websocket: WebSocket,
    train_number: str
):

    await connection_manager.connect(
        train_number,
        websocket
    )

    db: Session = SessionLocal()

    simulator_task = None

    try:

        # --------------------------------------
        # Check train exists in database
        # --------------------------------------

        train = (
            db.query(Train)
            .filter(
                Train.train_number == train_number
            )
            .first()
        )

        if train is None:

            await websocket.close(
                code=1008
            )

            return

        # --------------------------------------
        # Check simulation data exists
        # --------------------------------------

        if train_number not in TRAIN_SIMULATION_DATA:

            await websocket.close(
                code=1008
            )

            return

        # --------------------------------------
        # Create train-specific data
        # --------------------------------------

        train_data = {
            "train_number": train.train_number,
            "train_name": train.train_name,

            **TRAIN_SIMULATION_DATA[
                train_number
            ]
        }

        # --------------------------------------
        # Start simulator for this train
        # --------------------------------------

        simulator_task = asyncio.create_task(
            simulate_train_updates(
                train_number,
                train_data
            )
        )

        # --------------------------------------
        # Keep WebSocket connection alive
        # --------------------------------------

        try:

            while True:

                await websocket.receive_text()

        except WebSocketDisconnect:

            pass

    finally:

        # --------------------------------------
        # Stop simulator
        # --------------------------------------

        if simulator_task is not None:

            simulator_task.cancel()

            try:
                await simulator_task
            except asyncio.CancelledError:
                pass

        # --------------------------------------
        # Disconnect WebSocket
        # --------------------------------------

        connection_manager.disconnect(
            train_number,
            websocket
        )

        db.close()