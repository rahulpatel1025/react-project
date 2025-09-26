import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Use GEMINI_API_KEY from .env
const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Missing GEMINI_API_KEY in backend/.env");
}

let genAI;
try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI({ apiKey: API_KEY });
    console.log("Gemini client initialized.");
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenerativeAI:", e);
}

// ✅ Use Gemini 2.0 Flash model
const MODEL_ID = "gemini-2.0-flash";

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL_ID });
});

// Generate text endpoint
app.post("/api/generate", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });

    const { prompt } = req.body || {};
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt required" });
    }

    // ✅ API call using Gemini 2.0 Flash
    const response = await genAI.responses.create({
      model: MODEL_ID,
      input: prompt.trim()
    });

    const text = response.output_text || "";

    if (!text) {
      return res.status(502).json({ error: "Empty response from Gemini" });
    }

    res.json({ text });
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
