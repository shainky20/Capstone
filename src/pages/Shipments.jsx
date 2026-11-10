import React, { useState } from "react";
import Layout from "../components/Layout";

const SHIPMENTS = [
  { id: "S-847",  origin: "Mumbai",    dest: "Delhi",     cargo: "Pharmaceuticals", weight: "4,200 kg", status: "Delayed",    risk: "High",   eta: "31 Oct, 14:00", driver: "Rajan Mehta",    progress: 42 },
  { id: "S-923",  origin: "Bangalore", dest: "Chennai",   cargo: "Electronics",     weight: "1,800 kg", status: "En Route",   risk: "Medium", eta: "31 Oct, 09:30", driver: "Suresh Pillai",  progress: 68 },
  { id: "S-1012", origin: "Hyderabad", dest: "Kolkata",   cargo: "Auto Parts",      weight: "6,500 kg", status: "Delayed",    risk: "High",   eta: "01 Nov, 06:00", driver: "Dinesh Kumar",   progress: 19 },
  { id: "S-1045", origin: "Mumbai",    dest: "Ahmedabad", cargo: "FMCG Goods",      weight: "2,100 kg", status: "On Track",   risk: "Low",    eta: "30 Oct, 20:00", driver: "Prakash Nair",   progress: 85 },
  { id: "S-1078", origin: "Ahmedabad", dest: "Jaipur",    cargo: "Textiles",        weight: "850 kg",   status: "On Track",   risk: "Low",    eta: "30 Oct, 18:00", driver: "Amit Sharma",    progress: 91 },
  { id: "S-1102", origin: "Pune",      dest: "Hyderabad", cargo: "Machine Parts",   weight: "3,300 kg", status: "En Route",   risk: "Medium", eta: "01 Nov, 08:00", driver: "Vikram Rao",     progress: 54 },
  { id: "S-1130", origin: "Delhi",     dest: "Lucknow",   cargo: "Food & Beverages",weight: "1,200 kg", status: "Delivered",  risk: "Low",    eta: "30 Oct, 11:00", driver: "Manoj Singh",    progress: 100 },
  { id: "S-1145", origin: "Chennai",   dest: "Coimbatore",cargo: "Apparel",         weight: "640 kg",   status: "Delivered",  risk: "Low",    eta: "30 Oct, 10:30", driver: "Ramesh Babu",    progress: 100 },
];

const statusStyle = {
  Delayed:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  "En Route":{ bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  "On Track":{ bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Delivered: { bg: "#f8fafc", color: "#475569", border: "#e2e8f0" },
};

const riskStyle = {
  High:   { color: "#dc2626" },
  Medium: { color: "#d97706" },
  Low:    { color: "#16a34a" },
};

const progressColor = {
  High:   "linear-gradient(90deg,#f87171,#dc2626)",
  Medium: "linear-gradient(90deg,#fbbf24,#d97706)",
  Low:    "linear-gradient(90deg,#4ade80,#16a34a)",
};

export default function Shipments() {
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Delayed", "En Route", "On Track", "Delivered"];
  const visible = filter === "All" ? SHIPMENTS : SHIPMENTS.filter(s => s.status === filter);

  return (
    <Layout>
      <div style={{ display: "grid", gap: "20px" }}>
        {/* Header Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[
            { label: "Total Active", value: "247", color: "#2563eb" },
            { label: "Delayed",      value: "12",  color: "#dc2626" },
            { label: "On Track",     value: "197", color: "#16a34a" },
            { label: "Delivered Today", value: "38", color: "#475569" },
          ].map((s, i) => (
            <div key={i} style={{ ...card, padding: "20px" }}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px" }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 18px",
                borderRadius: "99px",
                border: filter === f ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                background: filter === f ? "#eff6ff" : "#ffffff",
                color: filter === f ? "#1d4ed8" : "#475569",
                fontWeight: filter === f ? "700" : "500",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div style={card}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Shipment ID", "Route", "Cargo", "Weight", "Driver", "Risk", "Progress", "ETA", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 14px", fontSize: "12px", color: "#94a3b8", fontWeight: "700", borderBottom: "1px solid #f1f5f9", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((s, i) => {
                const ss = statusStyle[s.status];
                const rs = riskStyle[s.risk];
                return (
                  <tr key={s.id} style={{ borderBottom: i < visible.length - 1 ? "1px solid #f8fafc" : "none" }}>
                    <td style={{ padding: "14px", fontWeight: "700", color: "#1e293b" }}>{s.id}</td>
                    <td style={{ padding: "14px", fontSize: "14px", color: "#475569" }}>{s.origin} → {s.dest}</td>
                    <td style={{ padding: "14px", fontSize: "14px", color: "#475569" }}>{s.cargo}</td>
                    <td style={{ padding: "14px", fontSize: "14px", color: "#475569" }}>{s.weight}</td>
                    <td style={{ padding: "14px", fontSize: "14px", color: "#475569" }}>{s.driver}</td>
                    <td style={{ padding: "14px", fontWeight: "700", color: rs.color }}>{s.risk}</td>
                    <td style={{ padding: "14px", minWidth: "120px" }}>
                      <div style={{ background: "#e2e8f0", borderRadius: "99px", height: "7px", position: "relative" }}>
                        <div style={{ width: `${s.progress}%`, height: "7px", borderRadius: "99px", background: progressColor[s.risk] }} />
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "3px" }}>{s.progress}%</div>
                    </td>
                    <td style={{ padding: "14px", fontSize: "13px", color: "#64748b" }}>{s.eta}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ padding: "4px 12px", borderRadius: "99px", fontSize: "13px", fontWeight: "600", background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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