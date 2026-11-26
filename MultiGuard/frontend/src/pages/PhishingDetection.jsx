import { useState } from "react";
import {
    ShieldAlert,
    Mail,
    Link,
    LoaderCircle,
    ScanSearch
} from "lucide-react";
import api from "../services/api";

function PhishingDetection() {
    const [mode, setMode] = useState("email");
    const [emailText, setEmailText] = useState("");
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzePhishing = async () => {
        const input = mode === "email" ? emailText : url;

        if (input.trim().length < (mode === "email" ? 10 : 5)) {
            setError(
                mode === "email"
                    ? "Please enter an email or message with at least 10 characters."
                    : "Please enter a valid URL."
            );
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = mode === "email"
                ? await api.post("/api/phishing/email/analyze", {
                    email_text: emailText
                })
                : await api.post("/api/phishing/url/analyze", {
                    url: url
                });

            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not analyze the input. Please try again."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setResult(null);
        setError("");
    };

    const getRiskLabel = (level) => {
        if (level === "High Risk" || level === "high_risk") {
            return "High Risk";
        }

        if (level === "Suspicious" || level === "suspicious") {
            return "Suspicious";
        }

        return "Likely Legitimate";
    };

    const getRiskClass = (level) => {
        if (level === "High Risk" || level === "high_risk") {
            return "high_risk";
        }

        if (level === "Suspicious" || level === "suspicious") {
            return "suspicious";
        }

        return "likely_legitimate";
    };

    const probabilities = result?.probabilities;
    const positiveLabel = "Phishing";
    const negativeLabel = mode === "email" ? "Safe" : "Legitimate";
    const positiveProbability = probabilities?.phishing;
    const negativeProbability = mode === "email"
        ? probabilities?.safe
        : probabilities?.legitimate;

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">DETECTION MODULE / 03</p>
                    <h1>Phishing Detection</h1>
                    <p className="page-subtitle">
                        Analyze suspicious emails, messages, and URLs
                        for potential phishing activity.
                    </p>
                </div>

                <div className="module-header-icon">
                    <ShieldAlert size={25} />
                </div>
            </div>

            <div className="analyzer-layout">
                <section className="content-card analyzer-card">
                    <div className="card-heading">
                        <div>
                            <h2>Phishing Analysis</h2>
                            <p>
                                Choose what you'd like MultiGuard to analyze.
                            </p>
                        </div>

                        <span className="model-tag">
                            MACHINE LEARNING
                        </span>
                    </div>

                    <div className="phishing-mode-toggle">
                        <button
                            className={`mode-button ${mode === "email" ? "active" : ""}`}
                            onClick={() => switchMode("email")}
                            disabled={loading}
                        >
                            <Mail size={17} />
                            Email / Message
                        </button>

                        <button
                            className={`mode-button ${mode === "url" ? "active" : ""}`}
                            onClick={() => switchMode("url")}
                            disabled={loading}
                        >
                            <Link size={17} />
                            URL Analysis
                        </button>
                    </div>

                    {mode === "email" ? (
                        <>
                            <label
                                htmlFor="phishing-email-input"
                                className="input-label"
                            >
                                Email or Message Text
                            </label>

                            <textarea
                                id="phishing-email-input"
                                className="review-input"
                                value={emailText}
                                onChange={(e) => setEmailText(e.target.value)}
                                placeholder="Paste a suspicious email or message here..."
                                rows={9}
                            />

                            <div className="analyzer-footer">
                                <span className="character-count">
                                    {emailText.length} characters
                                </span>

                                <button
                                    className="primary-button"
                                    onClick={analyzePhishing}
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
                                            Analyze Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <label
                                htmlFor="phishing-url-input"
                                className="input-label"
                            >
                                Website URL
                            </label>

                            <input
                                id="phishing-url-input"
                                className="review-input"
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !loading) {
                                        analyzePhishing();
                                    }
                                }}
                                placeholder="https://example.com/login"
                            />

                            <div className="analyzer-footer">
                                <span className="character-count">
                                    {url.length} characters
                                </span>

                                <button
                                    className="primary-button"
                                    onClick={analyzePhishing}
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
                                            Analyze URL
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {error && <p className="error-message">{error}</p>}
                </section>

                <aside className="content-card analyzer-info">
                    <div className="info-icon">
                        <ShieldAlert size={22} />
                    </div>

                    <h3>About this detector</h3>

                    <p>
                        MultiGuard uses two specialized machine learning
                        models to identify potential phishing threats
                        in messages and website URLs.
                    </p>

                    <div className="info-divider" />

                    <div className="info-detail">
                        <span>Email model</span>
                        <strong>TF-IDF + Logistic Regression</strong>
                    </div>

                    <div className="info-detail">
                        <span>URL model</span>
                        <strong>Random Forest</strong>
                    </div>

                    <div className="info-detail">
                        <span>Output</span>
                        <strong>Phishing risk estimate</strong>
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
                            <h2 className={`risk-label ${getRiskClass(result.risk_level)}`}>
                                {getRiskLabel(result.risk_level)}
                            </h2>
                        </div>

                        <div className="risk-score-container">
                            <p className="result-label">Phishing Risk Score</p>
                            <h2 className="risk-score">
                                {result.risk_score}%
                            </h2>
                        </div>
                    </div>

                    <div className="risk-bar">
                        <div
                            className={`risk-bar-fill ${getRiskClass(result.risk_level)}`}
                            style={{ width: `${result.risk_score}%` }}
                        />
                    </div>

                    <h3 className="probability-heading">
                        Model Probabilities
                    </h3>

                    <div className="probability-row">
                        <span>{positiveLabel}</span>
                        <strong>{positiveProbability}%</strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill deceptive-fill"
                            style={{ width: `${positiveProbability}%` }}
                        />
                    </div>

                    <div className="probability-row">
                        <span>{negativeLabel}</span>
                        <strong>{negativeProbability}%</strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill truthful-fill"
                            style={{ width: `${negativeProbability}%` }}
                        />
                    </div>

                    <p className="disclaimer">
                        This is a machine learning estimate based on
                        message content or URL characteristics. It is
                        not definitive proof that a message or website
                        is malicious or safe. The URL model analyzes
                        URL structure without visiting the website.
                    </p>
                </section>
            )}
        </div>
    );
}

export default PhishingDetection;
