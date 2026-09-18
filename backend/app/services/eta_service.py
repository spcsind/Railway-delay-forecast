from datetime import datetime, timedelta


def calculate_eta(
    scheduled_arrival: datetime,
    current_delay_minutes: float,
    predicted_delay_minutes: float
):
    """
    Calculate predicted arrival time using
    the ML-predicted future delay.
    """

    eta = scheduled_arrival + timedelta(
        minutes=predicted_delay_minutes
    )

    return {
        "scheduled_arrival": scheduled_arrival,
        "current_delay_minutes": current_delay_minutes,
        "predicted_delay_minutes": predicted_delay_minutes,
        "eta": eta
    }