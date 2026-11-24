import { History, Clock3 } from "lucide-react";

function HistoryPage() {
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

            <div className="content-card empty-history">
                <div className="empty-history-icon">
                    <Clock3 size={30} />
                </div>
                <h2>No analysis history yet</h2>
                <p>
                    Your completed analyses will appear here once history storage
                    is connected to the backend.
                </p>
            </div>
        </div>
    );
}

export default HistoryPage;
