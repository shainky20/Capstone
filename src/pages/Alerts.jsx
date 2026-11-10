import React, { useState } from "react";
import Layout from "../components/Layout";

const ALERT_DATA = [
  {
    id: "S-847",
    route: "Mumbai → Delhi",
    cause: "Heavy Rain + Congestion on NH48",
    risk: 84,
    delay: "5.1 hrs",
    level: "High",
    eta: "2026-10-31 14:00",
    cargo: "Pharmaceuticals",
    border: "#ef4444",
    bg: "#fef2f2",
  },
  {
    id: "S-923",
    route: "Bangalore → Chennai",
    cause: "Warehouse Bottleneck — 94% capacity",
    risk: 62,
    delay: "2.4 hrs",
    level: "Medium",
    eta: "2026-10-31 09:30",
    cargo: "Electronics",
    border: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    id: "S-1012",
    route: "Hyderabad → Kolkata",
    cause: "Cyclone alert — coastal diversion required",
    risk: 91,
    delay: "7.8 hrs",
    level: "High",
    eta: "2026-11-01 06:00",
    cargo: "Auto Parts",
    border: "#ef4444",
    bg: "#fef2f2",
  },
  {
    id: "S-1078",
    route: "Ahmedabad → Jaipur",
    cause: "Minor traffic delay near Vadodara",
    risk: 27,
    delay: "0.8 hrs",
    level: "Low",
    eta: "2026-10-30 18:00",
    cargo: "Textiles",
    border: "#22c55e",
    bg: "#f0fdf4",
  },
];

const DISTRIBUTION = [
  { label: "High Risk", count: 12, color: "#ef4444", pct: "4.9%" },
  { label: "Medium Risk", count: 38, color: "#f59e0b", pct: "15.4%" },
  { label: "Low Risk", count: 197, color: "#22c55e", pct: "79.7%" },
];

const levelColor = {
  High: { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  Medium: { text: "#d97706", bg: "#fffbeb", border: "#fed7aa" },
  Low: { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
};

export default function Alerts() {
  const [selected, setSelected] = useState(null);

  return (
    <Layout>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        {/* LEFT — Alert List */}
        <div style={card}>
          <h2 style={{ marginTop: 0, color: "#1e293b" }}>🚨 Live Disruption Alerts</h2>
          <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
            Click any alert to see full AI analysis
          </p>

          {ALERT_DATA.map((a) => {
            const lc = levelColor[a.level];
            const isSelected = selected?.id === a.id;
            return (
              <div
                key={a.id}
                onClick={() => setSelected(isSelected ? null : a)}
                style={{
                  marginBottom: "14px",
                  padding: "18px 20px",
                  borderRadius: "16px",
                  background: isSelected ? a.bg : "#f8fafc",
                  border: isSelected ? `1.5px solid ${a.border}` : "1.5px solid #e2e8f0",
                  borderLeft: `5px solid ${a.border}`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isSelected ? `0 4px 16px ${a.border}33` : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <strong style={{ color: "#1e293b", fontSize: "16px" }}>{a.id}</strong>
                      <span style={{
                        padding: "2px 10px",
                        borderRadius: "99px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background: lc.bg,
                        color: lc.text,
                        border: `1px solid ${lc.border}`,
                      }}>{a.level} Risk</span>
                    </div>
                    <p style={{ margin: 0, color: "#475569", fontSize: "14px" }}>{a.route} · {a.cargo}</p>
                    <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>{a.cause}</p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "70px" }}>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: a.border }}>{a.risk}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>risk score</div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isSelected && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      {[
                        { label: "Estimated Delay", value: a.delay },
                        { label: "Expected ETA", value: a.eta },
                        { label: "Risk Score", value: a.risk + "/100" },
                      ].map((item, i) => (
                        <div key={i} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px" }}>
                          <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginBottom: "4px" }}>{item.label.toUpperCase()}</div>
                          <div style={{ fontWeight: "700", color: "#1e293b" }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "12px", fontSize: "14px", color: "#1e40af" }}>
                      💡 <strong>AI Recommendation:</strong>{" "}
                      {a.level === "High"
                        ? `Immediate reroute advised. Engage backup carrier and notify ${a.route.split("→")[1].trim()} hub.`
                        : a.level === "Medium"
                        ? `Monitor closely. Pre-alert destination hub and consider express lane options.`
                        : `No action required. Shipment on schedule.`}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT — Distribution */}
        <div style={{ display: "grid", gap: "20px", alignContent: "start" }}>
          <div style={card}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>📊 Risk Distribution</h3>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>247 active shipments</p>

            {DISTRIBUTION.map((d, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
                  <span style={{ color: "#334155", fontWeight: "600" }}>{d.label}</span>
                  <span style={{ color: "#64748b" }}>{d.count} · {d.pct}</span>
                </div>
                <div style={{ background: "#e2e8f0", borderRadius: "99px", height: "10px" }}>
                  <div style={{
                    width: d.pct,
                    height: "10px",
                    borderRadius: "99px",
                    background: d.color,
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={card}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>⚡ Quick Stats</h3>
            {[
              { emoji: "🔴", label: "Urgent Actions", value: "2" },
              { emoji: "⏱", label: "Avg Delay", value: "3.2 hrs" },
              { emoji: "💰", label: "Loss at Risk", value: "₹4.2L" },
              { emoji: "🤖", label: "AI Confidence", value: "94.1%" },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none",
              }}>
                <span style={{ color: "#475569", fontSize: "14px" }}>{s.emoji} {s.label}</span>
                <span style={{ fontWeight: "700", color: "#1e293b" }}>{s.value}</span>
              </div>
            ))}
          </div>
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