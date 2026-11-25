import { useState } from "react";
import { BriefcaseBusiness, LoaderCircle } from "lucide-react";
import api from "../services/api";

function JobDetection() {
    const [job, setJob] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeJob = async () => {
        if (job.trim().length < 20) {
            setError("Please enter a job posting with at least 20 characters.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await api.post("/api/jobs/analyze", {
                job_text: job
            });

            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not analyze the job posting. Please try again."
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
                    <p className="eyebrow">DETECTION MODULE / 02</p>
                    <h1>Job Scam Detection</h1>
                    <p className="page-subtitle">
                        Analyze job postings for potentially fraudulent
                        employment opportunities.
                    </p>
                </div>

                <div className="module-header-icon">
                    <BriefcaseBusiness size={25} />
                </div>
            </div>

            <div className="analyzer-layout">
                <section className="content-card analyzer-card">
                    <div className="card-heading">
                        <div>
                            <h2>Job Posting Analysis</h2>
                            <p>
                                Enter the job posting you'd like the model to evaluate.
                            </p>
                        </div>

                        <span className="model-tag">
                            TF-IDF + LOGISTIC REGRESSION
                        </span>
                    </div>

                    <label htmlFor="job-input" className="input-label">
                        Job Posting
                    </label>

                    <textarea
                        id="job-input"
                        className="review-input"
                        value={job}
                        onChange={(e) => setJob(e.target.value)}
                        placeholder="Paste a job posting here, including the job description, requirements, company information, and benefits..."
                        rows={9}
                    />

                    <div className="analyzer-footer">
                        <span className="character-count">
                            {job.length} characters
                        </span>

                        <button
                            className="primary-button"
                            onClick={analyzeJob}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="spin" size={17} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BriefcaseBusiness size={17} />
                                    Analyze Job
                                </>
                            )}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </section>

                <aside className="content-card analyzer-info">
                    <div className="info-icon">
                        <BriefcaseBusiness size={22} />
                    </div>

                    <h3>About this detector</h3>

                    <p>
                        MultiGuard uses a trained machine learning pipeline
                        to examine job posting language and estimate whether
                        an employment opportunity may be fraudulent.
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
                        <strong>Fraud risk estimate</strong>
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

                        <span className="result-indicator">
                            Analysis complete
                        </span>
                    </div>

                    <div className="results-summary">
                        <div>
                            <p className="result-label">Risk Classification</p>
                            <h2 className={`risk-label ${result.risk_level}`}>
                                {getRiskLabel(result.risk_level)}
                            </h2>
                        </div>

                        <div className="risk-score-container">
                            <p className="result-label">Fraud Risk Score</p>
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

                    <h3 className="probability-heading">
                        Model Probabilities
                    </h3>

                    <div className="probability-row">
                        <span>Potentially Fraudulent</span>
                        <strong>
                            {result.probabilities.fraudulent}%
                        </strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill deceptive-fill"
                            style={{
                                width: `${result.probabilities.fraudulent}%`
                            }}
                        />
                    </div>

                    <div className="probability-row">
                        <span>Legitimate</span>
                        <strong>
                            {result.probabilities.legitimate}%
                        </strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill truthful-fill"
                            style={{
                                width: `${result.probabilities.legitimate}%`
                            }}
                        />
                    </div>

                    {result.explanation && (
                        <div className="explanation-section">
                            <h3>
                                Why did the model make this prediction?
                            </h3>

                            <p className="explanation-description">
                                These words and phrases had the strongest
                                influence on the model's prediction.
                            </p>

                            <div className="explanation-columns">
                                <div className="signal-group">
                                    <h4>Fraudulent Signals</h4>

                                    {result.explanation.fraudulent_signals.length > 0 ? (
                                        result.explanation.fraudulent_signals.map(
                                            (signal, index) => (
                                                <div
                                                    className="signal-item"
                                                    key={index}
                                                >
                                                    <span>{signal.term}</span>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>No strong fraudulent signals found.</p>
                                    )}
                                </div>

                                <div className="signal-group">
                                    <h4>Legitimate Signals</h4>

                                    {result.explanation.legitimate_signals.length > 0 ? (
                                        result.explanation.legitimate_signals.map(
                                            (signal, index) => (
                                                <div
                                                    className="signal-item"
                                                    key={index}
                                                >
                                                    <span>{signal.term}</span>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p>No strong legitimate signals found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="disclaimer">
                        This is a machine learning estimate, not definitive
                        proof that a job posting is fraudulent or legitimate.
                        Always independently verify employers and job offers.
                    </p>
                </section>
            )}
        </div>
    );
}

export default JobDetection;
