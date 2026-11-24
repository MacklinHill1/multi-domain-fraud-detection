import { useState } from "react";
import { ScanSearch, ArrowLeft, LoaderCircle } from "lucide-react";
import api from "../services/api";

function ReviewDetection() {
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
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">DETECTION MODULE / 01</p>
                    <h1>Review Detection</h1>
                    <p className="page-subtitle">
                        Analyze product and service reviews for potentially deceptive content.
                    </p>
                </div>
                <div className="module-header-icon">
                    <ScanSearch size={25} />
                </div>
            </div>

            <div className="analyzer-layout">
                <section className="content-card analyzer-card">
                    <div className="card-heading">
                        <div>
                            <h2>Review Analysis</h2>
                            <p>Enter the review you'd like the model to evaluate.</p>
                        </div>
                        <span className="model-tag">TF-IDF + LOGISTIC REGRESSION</span>
                    </div>

                    <label htmlFor="review-input" className="input-label">
                        Review Text
                    </label>

                    <textarea
                        id="review-input"
                        className="review-input"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Paste a product or service review here..."
                        rows={9}
                    />

                    <div className="analyzer-footer">
                        <span className="character-count">
                            {review.length} characters
                        </span>

                        <button
                            className="primary-button"
                            onClick={analyzeReview}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="spin" size={17} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <ScanSearch size={17} />
                                    Analyze Review
                                </>
                            )}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </section>

                <aside className="content-card analyzer-info">
                    <div className="info-icon">
                        <ScanSearch size={22} />
                    </div>
                    <h3>About this detector</h3>
                    <p>
                        MultiGuard uses a trained machine learning pipeline
                        to examine text patterns and estimate whether a review
                        may be deceptive.
                    </p>

                    <div className="info-divider" />

                    <div className="info-detail">
                        <span>Model</span>
                        <strong>Logistic Regression</strong>
                    </div>
                    <div className="info-detail">
                        <span>Text processing</span>
                        <strong>TF-IDF</strong>
                    </div>
                    <div className="info-detail">
                        <span>Output</span>
                        <strong>Risk estimate</strong>
                    </div>
                </aside>
            </div>

            {result && (
                <section className="content-card results-card">
                    <div className="card-heading">
                        <div>
                            <p className="eyebrow">MODEL OUTPUT</p>
                            <h2>Analysis Results</h2>
                        </div>
                        <span className="result-indicator">Analysis complete</span>
                    </div>

                    <div className="results-summary">
                        <div>
                            <p className="result-label">Risk Classification</p>
                            <h2 className={`risk-label ${result.risk_level}`}>
                                {getRiskLabel(result.risk_level)}
                            </h2>
                        </div>

                        <div className="risk-score-container">
                            <p className="result-label">Deceptive Risk Score</p>
                            <h2 className="risk-score">{result.risk_score}%</h2>
                        </div>
                    </div>

                    <div className="risk-bar">
                        <div
                            className={`risk-bar-fill ${result.risk_level}`}
                            style={{ width: `${result.risk_score}%` }}
                        />
                    </div>

                    <h3 className="probability-heading">Model Probabilities</h3>

                    <div className="probability-row">
                        <span>Potentially Deceptive</span>
                        <strong>{result.probabilities.deceptive}%</strong>
                    </div>
                    <div className="probability-track">
                        <div
                            className="probability-fill deceptive-fill"
                            style={{ width: `${result.probabilities.deceptive}%` }}
                        />
                    </div>

                    <div className="probability-row">
                        <span>Truthful</span>
                        <strong>{result.probabilities.truthful}%</strong>
                    </div>
                    <div className="probability-track">
                        <div
                            className="probability-fill truthful-fill"
                            style={{ width: `${result.probabilities.truthful}%` }}
                        />
                    </div>
                    {result.explanation && (
    <div className="explanation-section">
        <h3>Why did the model make this prediction?</h3>

        <p className="explanation-description">
            These words and phrases had the strongest influence
            on the model's prediction.
        </p>

        <div className="explanation-columns">
            <div className="signal-group">
                <h4>Deceptive Signals</h4>

                {result.explanation.deceptive_signals.length > 0 ? (
                    result.explanation.deceptive_signals.map((signal, index) => (
                        <div className="signal-item" key={index}>
                            <span>{signal.term}</span>
                        </div>
                    ))
                ) : (
                    <p>No strong deceptive signals found.</p>
                )}
            </div>

            <div className="signal-group">
                <h4>Truthful Signals</h4>

                {result.explanation.truthful_signals.length > 0 ? (
                    result.explanation.truthful_signals.map((signal, index) => (
                        <div className="signal-item" key={index}>
                            <span>{signal.term}</span>
                        </div>
                    ))
                ) : (
                    <p>No strong truthful signals found.</p>
                )}
            </div>
        </div>
    </div>
)}

                    <p className="disclaimer">
                        This is a machine learning estimate, not definitive proof
                        that a review is genuine or deceptive.
                    </p>
                </section>
            )}
        </div>
    );
}

export default ReviewDetection;
