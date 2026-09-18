from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:
    """
    Manages WebSocket connections for multiple trains.

    Each train can have multiple connected clients.
    """

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(
        self,
        train_number: str,
        websocket: WebSocket,
    ):
        await websocket.accept()

        if train_number not in self.active_connections:
            self.active_connections[train_number] = set()

        self.active_connections[train_number].add(websocket)

    def disconnect(
        self,
        train_number: str,
        websocket: WebSocket,
    ):
        connections = self.active_connections.get(train_number)

        if connections is None:
            return

        connections.discard(websocket)

        if not connections:
            del self.active_connections[train_number]

    async def send_to_train(
        self,
        train_number: str,
        message: dict,
    ):
        connections = self.active_connections.get(
            train_number,
            set(),
        )

        disconnected = set()

        for websocket in connections:
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.add(websocket)

        for websocket in disconnected:
            self.disconnect(train_number, websocket)

    async def broadcast(
        self,
        message: dict,
    ):
        for train_number in list(self.active_connections):
            await self.send_to_train(
                train_number,
                message,
            )


connection_manager = ConnectionManager()