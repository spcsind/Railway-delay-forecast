from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Train
from app.schemas.train import TrainStatus
from app.services.simulator import simulate_train_updates
from app.websocket.manager import connection_manager

import asyncio


router = APIRouter(prefix="/trains", tags=["Trains"])


@router.get("/", response_model=list[TrainStatus])
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


@router.get("/{train_number}", response_model=TrainStatus)
def get_train(train_number: str):
    db: Session = SessionLocal()

    try:
        train = (
            db.query(Train)
            .filter(Train.train_number == train_number)
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


@router.websocket("/ws/{train_number}")
async def train_websocket(
    websocket: WebSocket,
    train_number: str
):
    await connection_manager.connect(
        train_number,
        websocket
    )

    db: Session = SessionLocal()

    try:
        train = (
            db.query(Train)
            .filter(Train.train_number == train_number)
            .first()
        )

        if train is None:
            await websocket.close(code=1008)
            return

        # Temporary demo data for WebSocket simulation
        train_data = {
            "train_number": train.train_number,
            "train_name": train.train_name,
            "delay_minutes": 8.0,
            "distance_to_next": 28.0,
            "scheduled_travel_minutes": 19.0,
            "scheduled_arrival": "2026-09-19T10:51:00"
        }

        simulator_task = asyncio.create_task(
            simulate_train_updates(
                train_number,
                train_data
            )
        )

        try:
            while True:
                await websocket.receive_text()

        except WebSocketDisconnect:
            pass

        finally:
            simulator_task.cancel()

    finally:
        connection_manager.disconnect(
            train_number,
            websocket
        )

        db.close()