from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    zone_code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    zone_name: Mapped[str] = mapped_column(String(100), nullable=False)

    stations = relationship("Station", back_populates="zone")


class Station(Base):
    __tablename__ = "stations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    station_code: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False
    )
    station_name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    zone_id: Mapped[int | None] = mapped_column(
        ForeignKey("zones.id")
    )

    zone = relationship("Zone", back_populates="stations")


class Train(Base):
    __tablename__ = "trains"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    train_number: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False
    )
    train_name: Mapped[str] = mapped_column(
        String(150), nullable=False
    )
    train_type: Mapped[str | None] = mapped_column(
        String(50)
    )

    movements = relationship(
        "TrainMovement",
        back_populates="train"
    )

    predictions = relationship(
        "Prediction",
        back_populates="train"
    )


class Route(Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    route_name: Mapped[str] = mapped_column(
        String(200), nullable=False
    )
    source_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False
    )
    destination_station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False
    )


class RouteStation(Base):
    __tablename__ = "route_stations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    route_id: Mapped[int] = mapped_column(
        ForeignKey("routes.id"),
        nullable=False
    )

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False
    )

    sequence_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )


class TrainMovement(Base):
    __tablename__ = "train_movements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    train_id: Mapped[int] = mapped_column(
        ForeignKey("trains.id"),
        nullable=False
    )

    station_id: Mapped[int | None] = mapped_column(
        ForeignKey("stations.id")
    )

    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    speed: Mapped[float | None] = mapped_column(Float)

    delay_minutes: Mapped[float | None] = mapped_column(
        Float
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="UNKNOWN"
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    train = relationship(
        "Train",
        back_populates="movements"
    )


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    train_id: Mapped[int] = mapped_column(
        ForeignKey("trains.id"),
        nullable=False
    )

    next_station_id: Mapped[int | None] = mapped_column(
        ForeignKey("stations.id")
    )

    predicted_delay_minutes: Mapped[float | None] = mapped_column(
        Float
    )

    predicted_eta: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    lower_eta: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    upper_eta: Mapped[datetime | None] = mapped_column(
        DateTime
    )

    model_version: Mapped[str | None] = mapped_column(
        String(50)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    train = relationship(
        "Train",
        back_populates="predictions"
    )