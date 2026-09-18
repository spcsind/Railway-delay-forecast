from datetime import datetime, timedelta


def calculate_eta(
    scheduled_arrival: datetime,
    predicted_delay_minutes: float,
) -> datetime:
    """
    Calculate predicted arrival time using
    the ML-predicted future delay.
    """

    return scheduled_arrival + timedelta(
        minutes=predicted_delay_minutes
    )


def calculate_eta_details(
    scheduled_arrival: datetime,
    current_delay_minutes: float,
    predicted_delay_minutes: float,
):
    """
    Return complete ETA information for a train.
    """

    predicted_eta = calculate_eta(
        scheduled_arrival=scheduled_arrival,
        predicted_delay_minutes=predicted_delay_minutes,
    )

    delay_change = (
        predicted_delay_minutes - current_delay_minutes
    )

    return {
        "scheduled_arrival": scheduled_arrival,
        "current_delay_minutes": current_delay_minutes,
        "predicted_delay_minutes": predicted_delay_minutes,
        "delay_change_minutes": delay_change,
        "predicted_eta": predicted_eta,
    }