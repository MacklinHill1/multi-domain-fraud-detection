import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import ReviewDetection from "./pages/ReviewDetection";
import HistoryPage from "./pages/History";
import JobDetection from "./pages/JobDetection";
import PhishingDetection from "./pages/PhishingDetection";
import MarketplaceDetection from "./pages/MarketplaceDetection";
import api from "./services/api";

import "./App.css";

function App() {
    const [activePage, setActivePage] = useState("overview");

    const [dashboardStats, setDashboardStats] = useState({
        totalAnalyses: 0,
        potentialThreats: 0,
        recentActivity: "No activity"
    });

    useEffect(() => {
    let isActive = true;

    async function fetchDashboardStats() {
        try {
            const params = {
                limit: 500,
                offset: 0
            };

            const [
                reviewResponse,
                jobResponse,
                marketplaceResponse
            ] = await Promise.all([
                api.get("/api/reviews/history", { params }),
                api.get("/api/jobs/history", { params }),
                api.get("/api/marketplace/history", { params })
            ]);

            const allReports = [
                ...(reviewResponse.data.reports || []),
                ...(jobResponse.data.reports || []),
                ...(marketplaceResponse.data.reports || [])
            ];

            const potentialThreats = allReports.filter((report) => {
                const level = String(report.risk_level || "")
                    .toLowerCase()
                    .replaceAll(" ", "_");

                return level === "high_risk" || level === "suspicious";
            }).length;

            const sortedReports = [...allReports].sort(
                (a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
            );

            const recentActivity = sortedReports.length > 0
                ? new Date(sortedReports[0].created_at).toLocaleDateString(
                    [],
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                )
                : "No activity";

            if (isActive) {
                setDashboardStats({
                    totalAnalyses: allReports.length,
                    potentialThreats,
                    recentActivity
                });
            }
        } catch (error) {
            console.error("Could not load dashboard statistics:", error);
        }
    }

    // Refresh statistics whenever the user opens Overview.
    if (activePage === "overview") {
        fetchDashboardStats();
    }

    return () => {
        isActive = false;
    };
}, [activePage]);

    const pageTitles = {
        overview: "Overview",
        reviews: "Review Detection",
        history: "Analysis History",
        jobs: "Job Scam Detection",
        phishing: "Phishing Detection",
        marketplace: "Marketplace Fraud Detection"
    };

    const renderPage = () => {
        switch (activePage) {
            case "reviews":
                return <ReviewDetection />;

            case "history":
                return <HistoryPage />;

            case "jobs":
                return <JobDetection />;

            case "phishing":
                return <PhishingDetection />;

            case "marketplace":
                return <MarketplaceDetection />;

            default:
                return (
                    <Overview
                        onNavigate={setActivePage}
                        stats={dashboardStats}
                    />
                );
        }
    };

    return (
        <div className="app-shell">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
            />

            <main className="main-area">
                <header className="topbar">
                    <div className="breadcrumb">
                        <span>MultiGuard</span>
                        <ChevronRight size={15} />
                        <strong>{pageTitles[activePage]}</strong>
                    </div>

                    <div className="topbar-right">
                        <span className="environment-label">
                            DEVELOPMENT ENVIRONMENT
                        </span>
                    </div>
                </header>

                {renderPage()}
            </main>
        </div>
    );
}

export default App;