import {
    LayoutDashboard,
    ScanSearch,
    ShieldAlert,
    Store,
    BriefcaseBusiness,
    History,
    ShieldCheck
} from "lucide-react";

const navigation = [
    {
        section: "WORKSPACE",
        items: [
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "history", label: "Analysis History", icon: History }
        ]
    },
    {
        section: "DETECTION MODULES",
        items: [
            { id: "reviews", label: "Review Detection", icon: ScanSearch },
            { id: "phishing", label: "Phishing Detection", icon: ShieldAlert, comingSoon: true },
            { id: "marketplace", label: "Marketplace Fraud", icon: Store, comingSoon: true },
            { id: "jobs", label: "Job Scam Detection", icon: BriefcaseBusiness }
        ]
    }
];

function Sidebar({ activePage, onNavigate }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <ShieldCheck size={23} />
                </div>
                <div>
                    <h1>MultiGuard</h1>
                    <span>INTELLIGENCE PLATFORM</span>
                </div>
            </div>

            <div className="sidebar-divider" />

            <nav className="sidebar-navigation">
                {navigation.map((group) => (
                    <div className="nav-group" key={group.section}>
                        <p className="nav-section-label">{group.section}</p>

                        {group.items.map((item) => {
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    className={`nav-item ${
                                        activePage === item.id ? "active" : ""
                                    } ${item.comingSoon ? "disabled" : ""}`}
                                    onClick={() => {
                                        if (!item.comingSoon) {
                                            onNavigate(item.id);
                                        }
                                    }}
                                    disabled={item.comingSoon}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                    <span>{item.label}</span>

                                    {item.comingSoon && (
                                        <span className="coming-soon">SOON</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="system-status">
                    <span className="status-indicator" />
                    <div>
                        <strong>System Online</strong>
                        <span>Detection services active</span>
                    </div>
                </div>
                <p className="sidebar-version">MULTIGUARD · DEVELOPMENT BUILD</p>
            </div>
        </aside>
    );
}

export default Sidebar;
