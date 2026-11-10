import React, { useState } from "react";
import Layout from "../components/Layout";

const PRESETS = [
  {
    label: "🚨 High Risk – Mumbai → Delhi",
    origin: "Mumbai",
    destination: "Delhi",
    weather: "78",
    traffic: "9.2",
    cargo: "Pharmaceuticals",
    weight: "4200",
  },
  {
    label: "⚠️ Medium Risk – Pune → Hyderabad",
    origin: "Pune",
    destination: "Hyderabad",
    weather: "45",
    traffic: "5.5",
    cargo: "Electronics",
    weight: "2100",
  },
  {
    label: "✅ Low Risk – Ahmedabad → Jaipur",
    origin: "Ahmedabad",
    destination: "Jaipur",
    weather: "12",
    traffic: "2.8",
    cargo: "Textiles",
    weight: "850",
  },
];

function computeResult(form) {
  const weather = parseFloat(form.weather) || 0;
  const traffic = parseFloat(form.traffic) || 0;
  const weight = parseFloat(form.weight) || 0;

  // Weighted risk formula
  const rawScore = weather * 0.5 + traffic * 5 + Math.min(weight / 200, 10);
  const riskScore = Math.min(Math.round(rawScore), 99);

  const riskLevel =
    riskScore > 70 ? "High" : riskScore > 40 ? "Medium" : "Low";

  const delayHours =
    riskScore > 70
      ? (weather * 0.07 + traffic * 0.4).toFixed(1)
      : riskScore > 40
      ? (weather * 0.03 + traffic * 0.2).toFixed(1)
      : (traffic * 0.1).toFixed(1);

  const causes = [];
  if (weather > 60) causes.push("Heavy rain / storm conditions");
  if (weather > 30 && weather <= 60) causes.push("Moderate weather disruption");
  if (traffic > 7) causes.push("Severe traffic congestion");
  if (traffic > 4 && traffic <= 7) causes.push("Moderate traffic density");
  if (weight > 3000) causes.push("Overweight load — slower transit");
  if (causes.length === 0) causes.push("No major disruptions detected");

  const recommendation =
    riskScore > 70
      ? `Immediate reroute advised via ${form.origin === "Mumbai" ? "Ahmedabad" : "alternate"} corridor. Estimated saving: ${(parseFloat(delayHours) * 0.6).toFixed(1)} hrs.`
      : riskScore > 40
      ? `Monitor shipment closely. Consider express lane to ${form.destination}.`
      : `Shipment on optimal route. No action required.`;

  const confidence = Math.max(85, 99 - Math.abs(riskScore - 50) * 0.1);

  return { riskScore, riskLevel, delayHours, causes, recommendation, confidence: confidence.toFixed(0) };
}

const riskColor = {
  High: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626", badge: "#ef4444" },
  Medium: { bg: "#fffbeb", border: "#fed7aa", text: "#d97706", badge: "#f59e0b" },
  Low: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", badge: "#22c55e" },
};

export default function Prediction() {
  const [form, setForm] = useState({ ...PRESETS[0] });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePreset, setActivePreset] = useState(0);

  const handlePreset = (i) => {
    setActivePreset(i);
    setForm({ ...PRESETS[i] });
    setResult(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setActivePreset(null);
  };

  const runPrediction = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(computeResult(form));
      setLoading(false);
    }, 900);
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
              Preset values loaded — click <strong>Analyze</strong> to see AI output.
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
                <label style={labelStyle}>Weather Risk %</label>
                <input name="weather" value={form.weather} onChange={handleChange} style={inputStyle} placeholder="0–100" type="number" />
              </div>
              <div>
                <label style={labelStyle}>Traffic Index (0–10)</label>
                <input name="traffic" value={form.traffic} onChange={handleChange} style={inputStyle} placeholder="e.g. 7.5" type="number" step="0.1" />
              </div>
              <div>
                <label style={labelStyle}>Cargo Type</label>
                <input name="cargo" value={form.cargo} onChange={handleChange} style={inputStyle} placeholder="e.g. Electronics" />
              </div>
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input name="weight" value={form.weight} onChange={handleChange} style={inputStyle} placeholder="e.g. 2000" type="number" />
              </div>
            </div>

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
            <h2 style={{ marginTop: 0, color: "#1e293b" }}>Gemini AI Result</h2>

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
                    <span>Risk Score</span><span>{result.riskScore}/99</span>
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
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>ESTIMATED DELAY</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>{result.delayHours} hrs</div>
                  </div>
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>AI CONFIDENCE</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", color: "#2563eb" }}>{result.confidence}%</div>
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