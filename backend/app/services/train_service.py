from pathlib import Path

import pandas as pd
from xgboost import XGBRegressor


class TrainPredictionService:
    """
    Service responsible for loading the trained ML model
    and generating future-delay predictions.
    """

    def __init__(self):
        project_root = Path(__file__).resolve().parents[3]

        self.model_path = (
            project_root
            / "ml"
            / "models"
            / "train_eta_proto.json"
        )

        self.model = XGBRegressor()
        self.model.load_model(str(self.model_path))

    def predict_future_delay(
        self,
        current_delay: float,
        distance_to_next: float,
        scheduled_travel_minutes: float,
    ) -> float:

        input_data = pd.DataFrame(
            [
                {
                    "current_delay": current_delay,
                    "distance_to_next": distance_to_next,
                    "scheduled_travel_minutes": scheduled_travel_minutes,
                }
            ]
        )

        prediction = self.model.predict(input_data)[0]

        return float(prediction)


train_prediction_service = TrainPredictionService()