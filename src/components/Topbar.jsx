import React from "react";

export default function Topbar() {
  const now = new Date().toLocaleString();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
      }}
    >
      <div>
        <h1 style={{ color: "#1e293b", margin: 0 }}>
          Logistics Command Center ✦
        </h1>

        <p style={{ color: "#64748b", marginTop: "6px" }}>
          Real-time supply chain intelligence powered by AI
        </p>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "14px",
            background: "#f1f5f9",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
        >
          🕒 {now}
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderRadius: "14px",
            background: "#f1f5f9",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
        >
          🔔 7
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderRadius: "14px",
            background: "#f1f5f9",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          }}
        >
          Team JSS
        </div>
      </div>
    </div>
  );
}