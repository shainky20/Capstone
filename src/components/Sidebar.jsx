import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCpu,
  FiMap,
  FiAlertTriangle,
  FiTruck,
  FiBarChart2,
  FiSettings
} from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "AI Prediction", path: "/prediction", icon: <FiCpu /> },
    { name: "Route Optimizer", path: "/optimizer", icon: <FiMap /> },
    { name: "Alerts", path: "/alerts", icon: <FiAlertTriangle /> },
    { name: "Shipments", path: "/shipments", icon: <FiTruck /> },
    { name: "Analytics", path: "/analytics", icon: <FiBarChart2 /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        padding: "24px",
        color: "#1e293b",
        boxShadow: "2px 0 12px rgba(59,130,246,0.06)",
      }}
    >
      <div
        style={{
          padding: "18px",
          borderRadius: "18px",
          background: "linear-gradient(135deg,#0ea5e9,#1d4ed8)",
          fontWeight: "700",
          fontSize: "24px",
          marginBottom: "28px",
        }}
      >
        ⚡ SupplyChain Copilot
      </div>

      {menu.map((item, i) => {
        const active = location.pathname === item.path;

        return (
          <Link
            key={i}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "14px",
              marginBottom: "8px",
              textDecoration: "none",
              color: active ? "#ffffff" : "#475569",
              fontWeight: active ? "600" : "500",
              background: active
                ? "linear-gradient(90deg,#2563eb,#0ea5e9)"
                : "transparent",
              boxShadow: active
                ? "0 4px 14px rgba(37,99,235,.30)"
                : "none",
              transition: "all 0.2s ease",
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}

      <div
        style={{
          marginTop: "40px",
          padding: "18px",
          borderRadius: "16px",
          background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
          border: "1px solid #bfdbfe",
          color: "#1e40af",
          fontSize: "13px",
        }}
      >
        Powered by <br />
        <strong>Vertex AI + Gemini</strong>
      </div>
    </div>
  );
}