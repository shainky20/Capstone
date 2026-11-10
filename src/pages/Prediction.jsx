import React, { useState } from "react";
import Layout from "../components/Layout";
import api from "../api";

const PRESETS = [
  {
    label: "🚨 High-risk example – Los Angeles → Toronto",
    origin: "Los Angeles",
    destination: "Toronto",
    rain_mm: "68",
    wind_speed: "33",
    traffic_index: "95",
    distance_km: "10077",
    priority: "Critical",
    historical_delay: "7.2",
  },
  {
    label: "⚠️ Medium-risk example – Tokyo → Dubai",
    origin: "Tokyo",
    destination: "Dubai",
    rain_mm: "3",
    wind_speed: "35",
    traffic_index: "31",
    distance_km: "4157",
    priority: "Medium",
    historical_delay: "5.9",
  },
  {
    label: "✅ Low-risk example – Rotterdam → Toronto",
    origin: "Rotterdam",
    destination: "Toronto",
    rain_mm: "1",
    wind_speed: "1",
    traffic_index: "8",
    distance_km: "695",
    priority: "Critical",
    historical_delay: "0.8",
  },
];

function getCauses(form) {
  const causes = [];
  if (Number(form.rain_mm) >= 50) causes.push("Heavy rain conditions");
  else if (Number(form.rain_mm) >= 20) causes.push("Moderate rainfall");
  if (Number(form.wind_speed) >= 50) causes.push("High wind speed");
  if (Number(form.traffic_index) >= 70) causes.push("Severe traffic congestion");
  else if (Number(form.traffic_index) >= 40) causes.push("Moderate traffic density");
  if (Number(form.historical_delay) >= 3) causes.push("Significant historical delay");
  if (causes.length === 0) causes.push("No major disruptions detected");
  return causes;
}

const initialForm = (({ label, ...values }) => values)(PRESETS[0]);

const riskColor = {
  High: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626", badge: "#ef4444" },
  Medium: { bg: "#fffbeb", border: "#fed7aa", text: "#d97706", badge: "#f59e0b" },
  Low: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", badge: "#22c55e" },
};

export default function Prediction() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  const handlePreset = (i) => {
    setActivePreset(i);
    const { label, ...values } = PRESETS[i];
    setForm(values);
    setResult(null);
    setError("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setActivePreset(null);
    setResult(null);
    setError("");
  };

  const runPrediction = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        rain_mm: Number(form.rain_mm),
        wind_speed: Number(form.wind_speed),
        traffic_index: Number(form.traffic_index),
        distance_km: Number(form.distance_km),
        historical_delay: Number(form.historical_delay),
      };
      const { data } = await api.post("/predict-risk", payload);
      const riskScore = Number(data.risk_score);
      const riskLevel = data.risk_level;

      if (
        !Number.isFinite(riskScore) ||
        !riskColor[riskLevel] ||
        typeof data.recommendation !== "string"
      ) {
        throw new Error("The prediction service returned an invalid result.");
      }

      setResult({
        riskScore,
        riskLevel,
        recommendation: data.recommendation,
        causes: getCauses(payload),
        historicalDelay: payload.historical_delay,
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          requestError.message ||
          "Prediction service unavailable."
      );
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? riskColor[result.riskLevel] : riskColor["Low"];

  return (
    <Layout>
      <div style={{ display: "grid", gap: "20px" }}>
        {/* Preset Buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => handlePreset(i)}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: activePreset === i ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                background: activePreset === i ? "#eff6ff" : "#ffffff",
                color: activePreset === i ? "#1d4ed8" : "#475569",
                fontWeight: activePreset === i ? "700" : "500",
                cursor: "pointer",
                fontSize: "14px",
                transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "20px" }}>
          {/* LEFT — Input Form */}
          <div style={card}>
            <h2 style={{ marginTop: 0, color: "#1e293b" }}>🤖 AI Shipment Prediction</h2>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              Enter the features used by the trained Random Forest model, then click <strong>Analyze</strong>.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Origin City</label>
                <input name="origin" value={form.origin} onChange={handleChange} style={inputStyle} placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label style={labelStyle}>Destination City</label>
                <input name="destination" value={form.destination} onChange={handleChange} style={inputStyle} placeholder="e.g. Delhi" />
              </div>
              <div>
                <label style={labelStyle}>Rainfall (mm)</label>
                <input name="rain_mm" value={form.rain_mm} onChange={handleChange} style={inputStyle} min="0" max="120" type="number" required />
              </div>
              <div>
                <label style={labelStyle}>Wind Speed</label>
                <input name="wind_speed" value={form.wind_speed} onChange={handleChange} style={inputStyle} min="0" max="80" step="0.1" type="number" required />
              </div>
              <div>
                <label style={labelStyle}>Traffic Index (0–100)</label>
                <input name="traffic_index" value={form.traffic_index} onChange={handleChange} style={inputStyle} min="0" max="100" step="0.1" type="number" required />
              </div>
              <div>
                <label style={labelStyle}>Distance (km)</label>
                <input name="distance_km" value={form.distance_km} onChange={handleChange} style={inputStyle} min="0" type="number" required />
              </div>
              <div>
                <label style={labelStyle}>Shipment Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle} required>
                  {["Low", "Medium", "High", "Critical"].map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Historical Delay (hours)</label>
                <input name="historical_delay" value={form.historical_delay} onChange={handleChange} style={inputStyle} min="0" max="8" step="0.1" type="number" required />
              </div>
            </div>

            {error && (
              <p role="alert" style={{ color: "#b91c1c", margin: "14px 0 0" }}>
                {error}
              </p>
            )}

            <button
              onClick={runPrediction}
              disabled={loading}
              style={{
                ...buttonStyle,
                marginTop: "20px",
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? "⏳ Analyzing..." : "🔍 Analyze Shipment"}
            </button>
          </div>

          {/* RIGHT — Result Panel */}
          <div style={card}>
            <h2 style={{ marginTop: 0, color: "#1e293b" }}>Random Forest Result</h2>

            {!result ? (
              <div style={{ color: "#94a3b8", textAlign: "center", paddingTop: "60px" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🤖</div>
                <p>Select a preset or fill in values,<br />then click <strong>Analyze Shipment</strong>.</p>
              </div>
            ) : (
              <>
                {/* Risk Badge */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px",
                  borderRadius: "16px",
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  marginBottom: "14px",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>RISK LEVEL</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: colors.text }}>{result.riskLevel}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>RISK SCORE</div>
                    <div style={{ fontSize: "36px", fontWeight: "800", color: colors.badge }}>{result.riskScore}</div>
                  </div>
                </div>

                {/* Score Bar */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#64748b" }}>
                    <span>Risk Score</span><span>{result.riskScore}/100</span>
                  </div>
                  <div style={{ background: "#e2e8f0", borderRadius: "99px", height: "10px" }}>
                    <div style={{
                      width: `${result.riskScore}%`,
                      height: "10px",
                      borderRadius: "99px",
                      background: result.riskLevel === "High"
                        ? "linear-gradient(90deg,#f87171,#dc2626)"
                        : result.riskLevel === "Medium"
                        ? "linear-gradient(90deg,#fbbf24,#d97706)"
                        : "linear-gradient(90deg,#4ade80,#16a34a)",
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>HISTORICAL DELAY</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>{result.historicalDelay} hrs</div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>MODEL</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#2563eb" }}>Random Forest</div>
                  </div>
                </div>

                {/* Causes */}
                <div style={{ background: "#fafafa", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", marginBottom: "8px" }}>ROOT CAUSES</div>
                  {result.causes.map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", fontSize: "14px", color: "#334155" }}>
                      <span style={{ color: colors.badge }}>▶</span> {c}
                    </div>
                  ))}
                </div>

                {/* Recommendation */}
                <div style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "#1e40af",
                  fontSize: "14px",
                }}>
                  💡 <strong>Recommendation:</strong> {result.recommendation}
                </div>
              </>
            )}
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

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "700",
  color: "#64748b",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1.5px solid #e2e8f0",
  background: "#f8fafc",
  color: "#1e293b",
  outline: "none",
  fontSize: "15px",
  transition: "border-color 0.2s",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(90deg,#2563eb,#0ea5e9)",
  color: "white",
  fontWeight: "700",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
};