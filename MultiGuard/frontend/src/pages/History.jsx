import { useEffect, useState } from "react";
import {
    History,
    Clock3,
    Search,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    FileText
} from "lucide-react";
import api from "../services/api";

function HistoryPage() {
    const [reports, setReports] = useState([]);
    const [search, setSearch] = useState("");
    const [riskLevel, setRiskLevel] = useState("");
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let isActive = true;

        async function fetchHistory() {
            setLoading(true);
            setError("");

            try {
                const params = {
                    search: search.trim() || undefined,
                    risk_level: riskLevel || undefined,
                    limit: 100,
                    offset: 0
                };

                // Retrieve review and job reports simultaneously
                const [reviewResponse, jobResponse] = await Promise.all([
                    api.get("/api/reviews/history", { params }),
                    api.get("/api/jobs/history", { params })
                ]);

                const reviewReports = (
                    reviewResponse.data.reports || []
                ).map((report) => ({
                    ...report,
                    type: "review"
                }));

                const jobReports = (
                    jobResponse.data.reports || []
                ).map((report) => ({
                    ...report,
                    type: "job"
                }));

                // Combine both report types and sort newest first
                const combinedReports = [
                    ...reviewReports,
                    ...jobReports
                ].sort(
                    (a, b) =>
                        new Date(b.created_at) - new Date(a.created_at)
                );

                if (isActive) {
                    setReports(combinedReports);
                }
            } catch (err) {
                if (isActive) {
                    setError(
                        err.response?.data?.detail ||
                        "Could not load analysis history. Make sure the backend is running."
                    );
                    console.error(err);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        fetchHistory();

        return () => {
            isActive = false;
        };
    }, [search, riskLevel, refreshKey]);

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    function getRiskLabel(level) {
        const labels = {
            high_risk: "High Risk",
            suspicious: "Suspicious",
            likely_legitimate: "Likely Legitimate"
        };

        return labels[level] || level;
    }

    function getReportKey(report) {
        return `${report.type}-${report.id}`;
    }

    function toggleReport(report) {
        const reportKey = getReportKey(report);

        setSelectedReport(
            selectedReport === reportKey ? null : reportKey
        );
    }

    function getReportText(report) {
        return report.type === "job"
            ? report.job_text
            : report.review_text;
    }

    function getProbabilities(report) {
        if (report.type === "job") {
            return {
                positiveLabel: "Potentially Fraudulent",
                positive: report.fraudulent_probability,
                negativeLabel: "Legitimate",
                negative: report.legitimate_probability
            };
        }

        return {
            positiveLabel: "Potentially Deceptive",
            positive: report.deceptive_probability,
            negativeLabel: "Truthful",
            negative: report.truthful_probability
        };
    }

    function getSignals(report) {
        if (report.type === "job") {
            return {
                positiveLabel: "Fraudulent Signals",
                positive: report.explanation?.fraudulent_signals || [],
                negativeLabel: "Legitimate Signals",
                negative: report.explanation?.legitimate_signals || []
            };
        }

        return {
            positiveLabel: "Deceptive Signals",
            positive: report.explanation?.deceptive_signals || [],
            negativeLabel: "Truthful Signals",
            negative: report.explanation?.truthful_signals || []
        };
    }

    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">WORKSPACE / ACTIVITY</p>
                    <h1>Analysis History</h1>
                    <p className="page-subtitle">
                        Review previous detection results and track analysis activity.
                    </p>
                </div>

                <div className="module-header-icon">
                    <History size={25} />
                </div>
            </div>

            <div className="history-toolbar">
                <div className="history-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search all analyzed reports..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <select
                    className="history-filter"
                    value={riskLevel}
                    onChange={(event) => setRiskLevel(event.target.value)}
                >
                    <option value="">All Risk Levels</option>
                    <option value="high_risk">High Risk</option>
                    <option value="suspicious">Suspicious</option>
                    <option value="likely_legitimate">Likely Legitimate</option>
                </select>
            </div>

            <div className="history-results-header">
                <div>
                    <h2>Saved Reports</h2>
                    <p>
                        {reports.length}{" "}
                        {reports.length === 1 ? "report" : "reports"} found
                    </p>
                </div>

                <button
                    className="history-refresh"
                    onClick={() => setRefreshKey((current) => current + 1)}
                    title="Refresh history"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="content-card history-message">
                    <RefreshCw size={22} className="loading-icon" />
                    <p>Loading analysis history...</p>
                </div>
            ) : error ? (
                <div className="content-card history-message history-error">
                    <p>{error}</p>
                </div>
            ) : reports.length === 0 ? (
                <div className="content-card empty-history">
                    <div className="empty-history-icon">
                        <Clock3 size={30} />
                    </div>
                    <h2>No reports found</h2>
                    <p>
                        {search || riskLevel
                            ? "Try changing your search or risk filter."
                            : "Your completed analyses will appear here."}
                    </p>
                </div>
            ) : (
                <div className="history-report-list">
                    {reports.map((report) => {
                        const reportKey = getReportKey(report);
                        const isSelected = selectedReport === reportKey;
                        const probabilities = getProbabilities(report);
                        const signals = getSignals(report);
                        const reportText = getReportText(report);

                        return (
                            <div
                                className="content-card history-report"
                                key={reportKey}
                            >
                                <button
                                    className="history-report-main"
                                    onClick={() => toggleReport(report)}
                                >
                                    <div className="history-report-icon">
                                        <FileText size={20} />
                                    </div>

                                    <div className="history-report-info">
                                        <div className="history-report-topline">
                                            <span className="history-report-id">
                                                {report.type === "job"
                                                    ? "JOB REPORT"
                                                    : "REVIEW REPORT"}{" "}
                                                #{report.id}
                                            </span>

                                            <span className="history-report-id">
                                                {report.type === "job"
                                                    ? "Job Scam Detection"
                                                    : "Review Detection"}
                                            </span>

                                            <span
                                                className={`risk-label ${report.risk_level}`}
                                            >
                                                {getRiskLabel(report.risk_level)}
                                            </span>
                                        </div>

                                        <p className="history-review-text">
                                            {reportText}
                                        </p>

                                        <span className="history-date">
                                            <Clock3 size={13} />
                                            {formatDate(report.created_at)}
                                        </span>
                                    </div>

                                    <div className="history-score">
                                        <strong>
                                            {Number(report.risk_score).toFixed(2)}%
                                        </strong>
                                        <span>Risk Score</span>
                                    </div>

                                    <div className="history-expand-icon">
                                        {isSelected
                                            ? <ChevronUp size={19} />
                                            : <ChevronDown size={19} />}
                                    </div>
                                </button>

                                {isSelected && (
                                    <div className="history-report-details">
                                        <div className="history-detail-section">
                                            <h3>
                                                {report.type === "job"
                                                    ? "Original Job Posting"
                                                    : "Original Review"}
                                            </h3>
                                            <p>{reportText}</p>
                                        </div>

                                        <div className="history-detail-probabilities">
                                            <div>
                                                <span>
                                                    {probabilities.positiveLabel}
                                                </span>
                                                <strong>
                                                    {Number(
                                                        probabilities.positive
                                                    ).toFixed(2)}%
                                                </strong>
                                            </div>

                                            <div>
                                                <span>
                                                    {probabilities.negativeLabel}
                                                </span>
                                                <strong>
                                                    {Number(
                                                        probabilities.negative
                                                    ).toFixed(2)}%
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="history-detail-section">
                                            <h3>Model Explanation</h3>

                                            <div className="history-signal-columns">
                                                <div>
                                                    <h4>
                                                        {signals.positiveLabel}
                                                    </h4>

                                                    {signals.positive.length > 0 ? (
                                                        signals.positive.map(
                                                            (signal, index) => (
                                                                <div
                                                                    className="history-signal"
                                                                    key={index}
                                                                >
                                                                    <span>
                                                                        {signal.term}
                                                                    </span>
                                                                    <span>
                                                                        {signal.contribution}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <p>
                                                            No strong signals found.
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4>
                                                        {signals.negativeLabel}
                                                    </h4>

                                                    {signals.negative.length > 0 ? (
                                                        signals.negative.map(
                                                            (signal, index) => (
                                                                <div
                                                                    className="history-signal"
                                                                    key={index}
                                                                >
                                                                    <span>
                                                                        {signal.term}
                                                                    </span>
                                                                    <span>
                                                                        {signal.contribution}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <p>
                                                            No strong signals found.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;
