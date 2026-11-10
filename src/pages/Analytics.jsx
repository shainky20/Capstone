import React from "react";
import Layout from "../components/Layout";

const MONTHLY = [
  { month: "May",  shipments: 198, onTime: 192, delayed: 6  },
  { month: "Jun",  shipments: 210, onTime: 203, delayed: 7  },
  { month: "Jul",  shipments: 224, onTime: 218, delayed: 6  },
  { month: "Aug",  shipments: 237, onTime: 228, delayed: 9  },
  { month: "Sep",  shipments: 219, onTime: 214, delayed: 5  },
  { month: "Oct",  shipments: 247, onTime: 242, delayed: 5  },
];

const CORRIDORS = [
  { route: "Mumbai → Delhi",      pct: 87, risk: "High",   vol: 42 },
  { route: "Bangalore → Chennai", pct: 94, risk: "Medium", vol: 31 },
  { route: "Ahmedabad → Jaipur",  pct: 99, risk: "Low",    vol: 28 },
  { route: "Pune → Hyderabad",    pct: 91, risk: "Medium", vol: 24 },
  { route: "Delhi → Lucknow",     pct: 97, risk: "Low",    vol: 19 },
];

const riskColor = {
  High:   "#ef4444",
  Medium: "#f59e0b",
  Low:    "#22c55e",
};

const BAR_MAX = 247;

export default function Analytics() {
  return (
    <Layout>
      <div style={{ display: "grid", gap: "20px" }}>
        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[
            { label: "On-Time Rate",      value: "98.2%", sub: "↑ 1.3% vs last month", color: "#16a34a" },
            { label: "Avg Transit Time",  value: "14.6h", sub: "↓ 0.8h improved",       color: "#2563eb" },
            { label: "Loss Prevented",    value: "₹1.27L", sub: "via AI rerouting",     color: "#d97706" },
            { label: "CO₂ Optimized",     value: "2.1T",  sub: "route efficiency gain", color: "#0891b2" },
          ].map((k, i) => (
            <div key={i} style={card}>
              <div style={{ fontSize: "26px", fontWeight: "800", color: k.color }}>{k.value}</div>
              <div style={{ fontWeight: "600", color: "#1e293b", marginTop: "4px" }}>{k.label}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "20px" }}>
          {/* Monthly Bar Chart */}
          <div style={card}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>📦 Monthly Shipment Volume</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "200px", padding: "10px 0" }}>
              {MONTHLY.map((m, i) => {
                const h = (m.shipments / BAR_MAX) * 170;
                const oh = (m.onTime / BAR_MAX) * 170;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#2563eb" }}>{m.shipments}</div>
                    <div style={{ width: "100%", display: "flex", gap: "3px", alignItems: "flex-end", height: "170px" }}>
                      <div style={{ flex: 1, height: `${h}px`, background: "linear-gradient(180deg,#93c5fd,#2563eb)", borderRadius: "6px 6px 0 0" }} title="Total" />
                      <div style={{ flex: 1, height: `${oh}px`, background: "linear-gradient(180deg,#86efac,#16a34a)", borderRadius: "6px 6px 0 0" }} title="On Time" />
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{m.month}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#2563eb" }} /> Total Shipments
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#475569" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#16a34a" }} /> On Time
              </div>
            </div>
          </div>

          {/* Risk Donut */}
          <div style={card}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>🎯 Risk Breakdown</h3>
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 20px" }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                {/* Low 79.7% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" strokeWidth="22"
                  strokeDasharray={`${0.797 * 376.8} ${376.8}`} strokeDashoffset={`${0}`} transform="rotate(-90 80 80)" />
                {/* Medium 15.4% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#f59e0b" strokeWidth="22"
                  strokeDasharray={`${0.154 * 376.8} ${376.8}`} strokeDashoffset={`${-0.797 * 376.8}`} transform="rotate(-90 80 80)" />
                {/* High 4.9% */}
                <circle cx="80" cy="80" r="60" fill="none" stroke="#ef4444" strokeWidth="22"
                  strokeDasharray={`${0.049 * 376.8} ${376.8}`} strokeDashoffset={`${-(0.797 + 0.154) * 376.8}`} transform="rotate(-90 80 80)" />
                <text x="80" y="75" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e293b">247</text>
                <text x="80" y="93" textAnchor="middle" fontSize="11" fill="#94a3b8">shipments</text>
              </svg>
            </div>
            {[
              { label: "Low Risk",    val: "197 (79.7%)", color: "#22c55e" },
              { label: "Medium Risk", val: "38 (15.4%)",  color: "#f59e0b" },
              { label: "High Risk",   val: "12 (4.9%)",   color: "#ef4444" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: "14px", color: "#475569" }}>{item.label}</span>
                </div>
                <span style={{ fontWeight: "700", color: "#1e293b", fontSize: "14px" }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Corridor Performance */}
        <div style={card}>
          <h3 style={{ marginTop: 0, color: "#1e293b" }}>🛣️ Corridor Performance</h3>
          {CORRIDORS.map((c, i) => (
            <div key={i} style={{ marginBottom: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{c.route}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "99px", fontSize: "11px", fontWeight: "700", color: riskColor[c.risk], background: riskColor[c.risk] + "18" }}>
                    {c.risk}
                  </span>
                </div>
                <span style={{ color: "#64748b", fontSize: "14px" }}>{c.pct}% on-time · {c.vol} trips</span>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: "99px", height: "9px" }}>
                <div style={{
                  width: `${c.pct}%`, height: "9px", borderRadius: "99px",
                  background: c.pct >= 97
                    ? "linear-gradient(90deg,#4ade80,#16a34a)"
                    : c.pct >= 90
                    ? "linear-gradient(90deg,#fbbf24,#d97706)"
                    : "linear-gradient(90deg,#f87171,#dc2626)",
                }} />
              </div>
            </div>
          ))}
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