import joblib
from pathlib import Path

# Locate the saved machine learning model
PROJECT_DIR = Path(__file__).resolve().parents[3]
MODEL_PATH = PROJECT_DIR / "backend" / "models" / "review_detector.joblib"

class ReviewDetector:
    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Review detection model not found: {MODEL_PATH}"
            )

        self.model = joblib.load(MODEL_PATH)

    def analyze(self, review_text: str):
        # Get the model's predicted category and probabilities
        prediction = self.model.predict([review_text])[0]
        probabilities = self.model.predict_proba([review_text])[0]

        # Find the probability associated with each category
        class_probabilities = dict(
            zip(self.model.classes_, probabilities)
        )

        deceptive_probability = float(
            class_probabilities["deceptive"]
        )

        # Convert deceptive probability into a 0-100 risk score
        risk_score = round(deceptive_probability * 100, 2)

        # Assign a risk classification
        if risk_score >= 70:
            risk_level = "high_risk"
        elif risk_score >= 40:
            risk_level = "suspicious"
        else:
            risk_level = "likely_legitimate"

        return {
            "prediction": prediction,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "probabilities": {
                "deceptive": round(deceptive_probability * 100, 2),
                "truthful": round(
                    float(class_probabilities["truthful"]) * 100, 2
                )
            }
        }


# Create one reusable detector instance
review_detector = ReviewDetector()