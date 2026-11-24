
import { useState } from "react";
import api from "./services/api";

function App() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const testConnection = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.get("/api/test");

            setMessage(response.data.message);
        } catch (err) {
            setError("Could not connect to the MultiGuard backend.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>MultiGuard</h1>
            <p>Multi-domain fraud and deception detection platform</p>

            <button onClick={testConnection} disabled={loading}>
                {loading ? "Connecting..." : "Test Backend Connection"}
            </button>

            {message && (
                <p style={{ color: "green" }}>{message}</p>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </div>
    );
}

export default App;
