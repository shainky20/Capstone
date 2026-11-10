const path = require("node:path");
const { spawn } = require("node:child_process");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
const predictionFields = [
  "origin",
  "destination",
  "rain_mm",
  "wind_speed",
  "traffic_index",
  "distance_km",
  "priority",
  "historical_delay",
];
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "32kb" }));

function validatePredictionInput(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "A JSON object is required.";
  }

  for (const field of ["origin", "destination", "priority"]) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field} must be a non-empty string.`;
    }
  }

  for (const field of [
    "rain_mm",
    "wind_speed",
    "traffic_index",
    "distance_km",
    "historical_delay",
  ]) {
    if (
      typeof body[field] !== "number" ||
      !Number.isFinite(body[field]) ||
      body[field] < 0
    ) {
      return `${field} must be a non-negative number.`;
    }
  }

  return null;
}

function runPrediction(input) {
  return new Promise((resolve, reject) => {
    const python = process.env.PYTHON || (
      process.platform === "win32" ? "python" : "python3"
    );
    const scriptPath = path.join(__dirname, "predict.py");
    const child = spawn(python, [scriptPath], {
      cwd: path.resolve(__dirname, ".."),
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      child.kill();
      if (!settled) {
        settled = true;
        reject(new Error("Prediction process timed out."));
      }
    }, 30_000);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (error) => {
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;

      if (code !== 0) {
        return reject(new Error(stderr.trim() || `Python exited with code ${code}.`));
      }

      try {
        const result = JSON.parse(stdout);
        if (!Number.isFinite(result.risk_score)) {
          throw new Error("Python returned an invalid risk score.");
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    child.stdin.on("error", (error) => {
      clearTimeout(timeout);
      if (!settled) {
        settled = true;
        reject(error);
      }
    });
    child.stdin.end(JSON.stringify(input));
  });
}

app.get("/", (_req, res) => {
  res.send("Backend running successfully");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/predict-risk", async (req, res, next) => {
  const validationError = validatePredictionInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const input = Object.fromEntries(
    predictionFields.map((field) => [
      field,
      typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field],
    ])
  );

  try {
    const prediction = await runPrediction(input);
    const risk = prediction.risk_score;
    const riskLevel = risk > 75 ? "High" : risk > 45 ? "Medium" : "Low";

    return res.json({
      risk_score: risk,
      risk_level: riskLevel,
      recommendation:
        riskLevel === "High"
          ? "Immediate reroute advised"
          : riskLevel === "Medium"
          ? "Monitor shipment closely"
          : "Shipment safe",
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/chat", async (req, res, next) => {
  const message = typeof req.body?.message === "string"
    ? req.body.message.trim()
    : "";
  if (!message || message.length > 4000) {
    return res.status(400).json({
      error: "message must contain 1 to 4000 characters.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: "Gemini is not configured on the backend.",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    });
    const result = await model.generateContent(`
You are an expert AI Supply Chain Assistant.

Answer clearly and professionally.

Current Business Context:
- 247 active shipments
- 12 high-risk shipments
- Mumbai corridor congestion high
- On-time rate 98.2%

User Question:
${message}
`);

    return res.json({ reply: result.response.text() });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error.message === "Origin not allowed by CORS") {
    return res.status(403).json({ error: "Origin is not allowed." });
  }

  console.error("Request failed:", error.message);
  const status = Number.isInteger(error.status) ? error.status : 500;
  return res.status(status).json({
    error: status >= 500 ? "The request could not be completed." : error.message,
  });
});

const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;