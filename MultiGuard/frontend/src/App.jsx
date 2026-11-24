
import { useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
    const [review, setReview] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeReview = async () => {
        if (review.trim().length < 10) {
            setError("Please enter a review with at least 10 characters.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await api.post("/api/reviews/analyze", {
                review_text: review
            });

            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not analyze the review. Please try again."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskLabel = (level) => {
        if (level === "high_risk") return "High Risk";
        if (level === "suspicious") return "Suspicious";
        return "Likely Legitimate";
    };

    return (
        <div className="app">
            <div className="app-container">

                <header className="app-header">
                    <h1>MultiGuard</h1>
                    <p>Multi-domain fraud and deception detection platform</p>
                </header>

                <section className="review-card">
                    <h2>Review Detection</h2>

                    <p className="section-description">
                        Analyze a product or service review to identify
                        potentially deceptive content using machine learning.
                    </p>

                    <label htmlFor="review-input" className="input-label">
                        Review Text
                    </label>

                    <textarea
                        id="review-input"
                        className="review-input"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Paste the review you want MultiGuard to analyze..."
                        rows={7}
                    />

                    <div className="input-footer">
                        <span className="character-count">
                            {review.length} characters
                        </span>

                        <button
                            className="analyze-button"
                            onClick={analyzeReview}
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Analyze Review"}
                        </button>
                    </div>

                    {error && (
                        <p className="error-message">{error}</p>
                    )}
                </section>

                {result && (
                    <section className="results-card">
                        <h2>Analysis Results</h2>

                        <div className="results-summary">
                            <div>
                                <p className="result-label">
                                    Risk Classification
                                </p>
                                <h2 className={`risk-label ${result.risk_level}`}>
                                    {getRiskLabel(result.risk_level)}
                                </h2>
                            </div>

                            <div className="risk-score-container">
                                <p className="result-label">
                                    Deceptive Risk Score
                                </p>
                                <h2 className="risk-score">
                                    {result.risk_score}%
                                </h2>
                            </div>
                        </div>

                        <div className="risk-bar">
                            <div
                                className={`risk-bar-fill ${result.risk_level}`}
                                style={{ width: `${result.risk_score}%` }}
                            />
                        </div>

                        <h3>Model Probabilities</h3>

                        <div className="probability-row">
                            <span>Potentially Deceptive</span>
                            <strong>{result.probabilities.deceptive}%</strong>
                        </div>

                        <div className="probability-row">
                            <span>Truthful</span>
                            <strong>{result.probabilities.truthful}%</strong>
                        </div>

                        <p className="disclaimer">
                            This result is a machine learning estimate, not
                            definitive proof that a review is genuine or deceptive.
                        </p>
                    </section>
                )}
            </div>
        </div>
    );
}

export default App;
