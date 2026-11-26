import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import ReviewDetection from "./pages/ReviewDetection";
import HistoryPage from "./pages/History";
import JobDetection from "./pages/JobDetection";
import PhishingDetection from "./pages/PhishingDetection";

import "./App.css";

function App() {
    const [activePage, setActivePage] = useState("overview");

    const pageTitles = {
        overview: "Overview",
        reviews: "Review Detection",
        history: "Analysis History",
        jobs: "Job Scam Detection",
        phishing: "Phishing Detection"
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
            default:
                return <Overview onNavigate={setActivePage} />;
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
                        <button className="topbar-icon" aria-label="Notifications">
                            <Bell size={19} />
                        </button>
                        <div className="user-avatar">MG</div>
                    </div>
                </header>

                {renderPage()}
            </main>
        </div>
    );
}

export default App;
