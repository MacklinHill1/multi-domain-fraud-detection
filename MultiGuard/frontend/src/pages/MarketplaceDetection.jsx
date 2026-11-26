import { useState } from "react";
import { ShoppingBag, LoaderCircle } from "lucide-react";
import api from "../services/api";

function MarketplaceDetection() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Electronics");
    const [sellerInformation, setSellerInformation] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash on pickup");
    const [urgencySignal, setUrgencySignal] = useState("None");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const analyzeListing = async () => {
        if (
            title.trim().length < 3 ||
            description.trim().length < 10 ||
            sellerInformation.trim().length < 3 ||
            price === "" ||
            Number(price) < 0
        ) {
            setError("Please provide a title, description, valid price, and seller information.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await api.post("/api/marketplace/analyze", {
                title,
                description,
                price: Number(price),
                category,
                seller_information: sellerInformation,
                payment_method: paymentMethod,
                urgency_signal: urgencySignal
            });

            setResult(response.data);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Could not analyze the marketplace listing. Please try again."
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskLabel = (level) => {
        if (level === "High Risk" || level === "high_risk") return "High Risk";
        if (level === "Suspicious" || level === "suspicious") return "Suspicious";
        return "Likely Legitimate";
    };

    const getRiskClass = (level) => {
        if (level === "High Risk" || level === "high_risk") return "high_risk";
        if (level === "Suspicious" || level === "suspicious") return "suspicious";
        return "likely_legitimate";
    };

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">DETECTION MODULE / 04</p>
                    <h1>Marketplace Fraud Detection</h1>
                    <p className="page-subtitle">
                        Analyze product listings for suspicious sellers,
                        payment requests, pricing, and scam signals.
                    </p>
                </div>

                <div className="module-header-icon">
                    <ShoppingBag size={25} />
                </div>
            </div>

            <div className="analyzer-layout">
                <section className="content-card analyzer-card marketplace-card">
                    <div className="card-heading">
                        <div>
                            <h2>Product Listing Analysis</h2>
                            <p>Enter the listing details you'd like the model to evaluate.</p>
                        </div>

                        <span className="model-tag">
                            TF-IDF + LOGISTIC REGRESSION
                        </span>
                    </div>

                    <div className="marketplace-form-grid">
                        <div className="marketplace-field full-width">
                            <label htmlFor="listing-title" className="input-label">
                                Product Title
                            </label>
                            <input
                                id="listing-title"
                                className="review-input marketplace-input"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Example: iPhone 15 Pro Max"
                            />
                        </div>

                        <div className="marketplace-field full-width">
                            <label htmlFor="listing-description" className="input-label">
                                Listing Description
                            </label>
                            <textarea
                                id="listing-description"
                                className="review-input marketplace-input marketplace-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the product, its condition, and the seller's message..."
                                rows={4}
                            />
                        </div>

                        <div className="marketplace-field marketplace-price-field">
                            <label htmlFor="listing-price" className="input-label">
                                Asking Price ($)
                            </label>
                            <input
                                id="listing-price"
                                className="review-input marketplace-input"
                                type="number"
                                min="0"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>

                        <div className="marketplace-field">
                            <label htmlFor="listing-category" className="input-label">
                                Product Category
                            </label>
                            <select
                                id="listing-category"
                                className="review-input marketplace-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {[
                                    "Electronics",
                                    "Furniture",
                                    "Clothing",
                                    "Vehicles",
                                    "Home & Garden",
                                    "Sports",
                                    "Collectibles",
                                    "Toys",
                                    "Other"
                                ].map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <div className="marketplace-field full-width">
                            <label htmlFor="seller-information" className="input-label">
                                Seller Information
                            </label>
                            <textarea
                                id="seller-information"
                                className="review-input marketplace-input marketplace-textarea seller-textarea"
                                value={sellerInformation}
                                onChange={(e) => setSellerInformation(e.target.value)}
                                placeholder="Describe the seller's profile, account history, or communication..."
                                rows={3}
                            />
                        </div>

                        <div className="marketplace-field">
                            <label htmlFor="payment-method" className="input-label">
                                Requested Payment Method
                            </label>
                            <select
                                id="payment-method"
                                className="review-input marketplace-input"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option>Cash on pickup</option>
                                <option>Platform payment</option>
                                <option>PayPal Goods and Services</option>
                                <option>Bank transfer</option>
                                <option>Wire transfer</option>
                                <option>Gift cards</option>
                                <option>Cryptocurrency</option>
                                <option>Friends and Family payment</option>
                            </select>
                        </div>

                        <div className="marketplace-field">
                            <label htmlFor="urgency-signal" className="input-label">
                                Urgency or Pressure Signals
                            </label>
                            <select
                                id="urgency-signal"
                                className="review-input marketplace-input"
                                value={urgencySignal}
                                onChange={(e) => setUrgencySignal(e.target.value)}
                            >
                                <option>None</option>
                                <option>Limited time offer</option>
                                <option>Multiple buyers interested</option>
                                <option>Deposit required immediately</option>
                                <option>Must pay today</option>
                            </select>
                        </div>
                    </div>

                    <div className="analyzer-footer">
                        <span className="character-count">
                            {description.length} description characters
                        </span>

                        <button
                            className="primary-button"
                            onClick={analyzeListing}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="spin" size={17} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={17} />
                                    Analyze Listing
                                </>
                            )}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                </section>

                <aside className="content-card analyzer-info">
                    <div className="info-icon">
                        <ShoppingBag size={22} />
                    </div>

                    <h3>About this detector</h3>

                    <p>
                        MultiGuard uses a machine learning pipeline to examine
                        marketplace listing details and estimate whether a
                        product listing may be fraudulent.
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
                        <span>Additional features</span>
                        <strong>Price and listing signals</strong>
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
                            <p className="result-label">Fraud Risk Score</p>
                            <h2 className="risk-score">{result.risk_score}%</h2>
                        </div>
                    </div>

                    <div className="risk-bar">
                        <div
                            className={`risk-bar-fill ${getRiskClass(result.risk_level)}`}
                            style={{ width: `${result.risk_score}%` }}
                        />
                    </div>

                    <h3 className="probability-heading">Model Probabilities</h3>

                    <div className="probability-row">
                        <span>Potentially Fraudulent</span>
                        <strong>{result.probabilities.fraudulent}%</strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill deceptive-fill"
                            style={{ width: `${result.probabilities.fraudulent}%` }}
                        />
                    </div>

                    <div className="probability-row">
                        <span>Legitimate</span>
                        <strong>{result.probabilities.legitimate}%</strong>
                    </div>

                    <div className="probability-track">
                        <div
                            className="probability-fill truthful-fill"
                            style={{ width: `${result.probabilities.legitimate}%` }}
                        />
                    </div>

<div className="history-detail-section marketplace-explanation">
    <h3>Why Was This Listing Flagged?</h3>

    <p>
        These are observable indicators found in the submitted listing.
        They are warning signs, not proof of fraud.
    </p>

    <div className="history-signal-columns">
        <div>
            <h4>Potential Fraud Signals</h4>

            {result.explanation?.fraudulent_signals?.length > 0 ? (
                result.explanation.fraudulent_signals.map((signal, index) => (
                    <div className="history-signal" key={index}>
                        <span>{signal.term}</span>
                        <span>{signal.contribution}</span>
                    </div>
                ))
            ) : (
                <p>No obvious warning signs identified.</p>
            )}
        </div>

        <div>
            <h4>Potentially Safer Signals</h4>

            {result.explanation?.legitimate_signals?.length > 0 ? (
                result.explanation.legitimate_signals.map((signal, index) => (
                    <div className="history-signal" key={index}>
                        <span>{signal.term}</span>
                        <span>{signal.contribution}</span>
                    </div>
                ))
            ) : (
                <p>No clear protective signals identified.</p>
            )}
        </div>
    </div>
</div>

                    <p className="disclaimer">
                        This is a machine learning estimate, not definitive
                        proof that a listing is fraudulent or legitimate.
                        Always independently verify sellers and payment requests.
                    </p>
                </section>
            )}
        </div>
    );
}

export default MarketplaceDetection;