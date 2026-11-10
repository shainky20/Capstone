import React from "react";
import Layout from "../components/Layout";

export default function Settings() {
  return (
    <Layout>
      <div style={{ display: "grid", gap: "20px", maxWidth: "700px" }}>
        <div style={card}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>⚙️ Settings</h2>

          {[
            { label: "Theme",             value: "White & Blue (Light Mode)" },
            { label: "AI Model",          value: "Gemini 1.5 Flash" },
            { label: "Risk Threshold",    value: "High > 70 | Medium > 40" },
            { label: "Notification Mode", value: "Real-time Alerts" },
            { label: "API Region",        value: "asia-south1 (Mumbai)" },
            { label: "Data Refresh",      value: "Every 60 seconds" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "16px 0",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <span style={{ color: "#64748b", fontWeight: "600", fontSize: "14px" }}>{s.label}</span>
              <span style={{ color: "#1e293b", fontWeight: "700", fontSize: "14px",
                padding: "6px 14px", background: "#f1f5f9", borderRadius: "99px" }}>{s.value}</span>
            </div>
          ))}
        </div>

        <div style={{ ...card, background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1px solid #bfdbfe" }}>
          <h3 style={{ marginTop: 0, color: "#1e40af" }}>ℹ️ System Info</h3>
          <p style={{ color: "#1e40af", fontSize: "14px", margin: 0 }}>
            Running in <strong>Demo Mode</strong> — preset values are used to simulate live AI responses.
            Connect the backend server on <code>localhost:5000</code> to enable live ML predictions and Gemini chat.
          </p>
        </div>
      </div>
    </Layout>
  );
}

const card = {
  background: "#ffffff",
  borderRadius: "20px",
  padding: "24px",
  color: "#1e293b",
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 20px rgba(37,99,235,0.08)",
};