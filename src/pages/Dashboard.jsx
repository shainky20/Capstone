import React from "react";
import Layout from "../components/Layout";

export default function Dashboard() {
  const cardStyle = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    color: "#1e293b",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 20px rgba(37,99,235,0.08)",
  };

  const statCards = [
    {
      value: "247",
      label: "Active Shipments",
      color: "#f59e0b",
    },
    {
      value: "12",
      label: "Critical Risk",
      color: "#ef4444",
    },
    {
      value: "98.2%",
      label: "On-Time Rate",
      color: "#22c55e",
    },
    {
      value: "$127K",
      label: "Loss Prevented",
      color: "#f59e0b",
    },
  ];

  return (
    <Layout>
      <div style={{ display: "grid", gap: "20px" }}>
        <h1 style={{ color: "#1e293b", margin: 0 }}>
          Logistics Command Center ✦
        </h1>

        {/* Top Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {statCards.map((item, i) => (
            <div key={i} style={cardStyle}>
              <h2
                style={{
                  color: item.color,
                  margin: 0,
                }}
              >
                {item.value}
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Dashboard Image Section */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>
            Global Shipments Overview
          </h2>

          <img
            src="/dashboard-map.png"
            alt="Global Shipments Overview"
            style={{
              width: "100%",
              marginTop: "16px",
              borderRadius: "18px",
              display: "block",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </Layout>
  );
}