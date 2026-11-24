import {
    ScanSearch,
    ShieldAlert,
    Store,
    BriefcaseBusiness,
    ArrowUpRight,
    Activity,
    Clock3
} from "lucide-react";

const modules = [
    {
        id: "reviews",
        title: "Review Detection",
        description: "Identify potentially deceptive product and service reviews.",
        icon: ScanSearch,
        status: "ACTIVE",
        active: true
    },
    {
        id: "phishing",
        title: "Phishing Detection",
        description: "Analyze suspicious messages, links, and potential scams.",
        icon: ShieldAlert,
        status: "COMING SOON"
    },
    {
        id: "marketplace",
        title: "Marketplace Fraud",
        description: "Identify suspicious listings and potential marketplace scams.",
        icon: Store,
        status: "COMING SOON"
    },
    {
        id: "jobs",
        title: "Job Scam Detection",
        description: "Evaluate job offers and identify potentially fraudulent opportunities.",
        icon: BriefcaseBusiness,
        status: "COMING SOON"
    }
];

function Overview({ onNavigate }) {
    return (
        <div className="page-content">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">PLATFORM OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <p className="page-subtitle">
                        Monitor detection activity and manage your analysis workspace.
                    </p>
                </div>

                <div className="system-badge">
                    <span className="status-indicator" />
                    All systems operational
                </div>
            </div>

            <div className="welcome-panel">
                <div className="welcome-content">
                    <span className="welcome-label">MULTI-DOMAIN THREAT INTELLIGENCE</span>
                    <h2>Welcome to MultiGuard</h2>
                    <p>
                        A unified platform for identifying deceptive content
                        across reviews, communications, marketplaces, and job offers.
                    </p>
                    <button
                        className="primary-button"
                        onClick={() => onNavigate("reviews")}
                    >
                        Start an analysis
                        <ArrowUpRight size={17} />
                    </button>
                </div>
                <div className="welcome-decoration">
                    <div className="decoration-circle">
                        <ShieldAlert size={66} strokeWidth={1.2} />
                    </div>
                </div>
            </div>

            <div className="section-heading">
                <div>
                    <h2>Platform Activity</h2>
                    <p>Analysis statistics will appear here as history tracking is added.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-top">
                        <span>Total Analyses</span>
                        <Activity size={19} />
                    </div>
                    <h3>—</h3>
                    <p>Awaiting history integration</p>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <span>Potential Threats</span>
                        <ShieldAlert size={19} />
                    </div>
                    <h3>—</h3>
                    <p>Awaiting history integration</p>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <span>Detection Modules</span>
                        <ScanSearch size={19} />
                    </div>
                    <h3>1 <span className="stat-total">/ 4</span></h3>
                    <p>One module currently active</p>
                </div>

                <div className="stat-card">
                    <div className="stat-top">
                        <span>Recent Activity</span>
                        <Clock3 size={19} />
                    </div>
                    <h3>—</h3>
                    <p>Awaiting history integration</p>
                </div>
            </div>

            <div className="section-heading modules-heading">
                <div>
                    <h2>Detection Modules</h2>
                    <p>Specialized machine learning tools for different types of deception.</p>
                </div>
            </div>

            <div className="modules-grid">
                {modules.map((module) => {
                    const Icon = module.icon;

                    return (
                        <div className="module-card" key={module.id}>
                            <div className="module-card-top">
                                <div className="module-icon">
                                    <Icon size={21} />
                                </div>
                                <span className={`module-status ${module.active ? "active" : ""}`}>
                                    {module.status}
                                </span>
                            </div>

                            <h3>{module.title}</h3>
                            <p>{module.description}</p>

                            <button
                                className="module-link"
                                onClick={() => module.active && onNavigate(module.id)}
                                disabled={!module.active}
                            >
                                {module.active ? "Open module" : "Under development"}
                                {module.active && <ArrowUpRight size={16} />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Overview;
