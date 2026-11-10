const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { exec } = require("child_process");

const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   GEMINI SETUP
================================= */
const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

/* ===============================
   ROOT CHECK
================================= */
app.get("/", (req, res) => {
  res.send(
    "Backend running successfully"
  );
});

/* ===============================
   REAL ML PREDICTION API
================================= */
app.post(
  "/predict-risk",
  (req, res) => {
    const input =
      JSON.stringify(
        req.body
      );

    exec(
      `python predict.py "${input}"`,
      {
        cwd: __dirname,
      },
      (
        error,
        stdout,
        stderr
      ) => {
        if (
          error
        ) {
          console.log(
            stderr
          );

          return res
            .status(
              500
            )
            .json({
              error:
                "Prediction failed",
            });
        }

        const risk =
          parseFloat(
            stdout
          );

        res.json({
          risk_score:
            risk,
          risk_level:
            risk >
            75
              ? "High"
              : risk >
                45
              ? "Medium"
              : "Low",
          recommendation:
            risk >
            75
              ? "Immediate reroute advised"
              : risk >
                45
              ? "Monitor shipment closely"
              : "Shipment safe",
        });
      }
    );
  }
);

/* ===============================
   GEMINI CHATBOT API
================================= */
app.post(
  "/chat",
  async (
    req,
    res
  ) => {
    try {
      const {
        message,
      } =
        req.body;

      const model =
        genAI.getGenerativeModel(
          {
            model:
              "gemini-1.5-flash",
          }
        );

      const result =
        await model.generateContent(
          `
You are an expert AI Supply Chain Assistant.

Answer clearly and professionally.

Current Business Context:
- 247 active shipments
- 12 high-risk shipments
- Mumbai corridor congestion high
- On-time rate 98.2%

User Question:
${message}
`
        );

      const reply =
        result.response.text();

      res.json({
        reply,
      });
    } catch (
      error
    ) {
      console.log(
        error
      );

      res
        .status(
          500
        )
        .json({
          reply:
            "Gemini service unavailable right now.",
        });
    }
  }
);

/* ===============================
   START SERVER
================================= */
const PORT =
  process.env
    .PORT ||
  5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);