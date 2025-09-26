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

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: Missing GEMINI_API_KEY in backend/.env");
}

let genAI;
try {
  if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("Gemini client initialized.");
  }
} catch (e) {
  console.error("Failed to init GoogleGenerativeAI:", e);
}

// ✅ Use a valid Gemini model
const MODEL_ID = "gemini-1.5-turbo";

app.post("/api/generate", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });

    const { prompt } = req.body || {};
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    // SDK now supports passing string directly
    const result = await model.generateContent(prompt.trim());

    // Extract text safely
    let text = "";
    try {
      if (result?.response?.text) {
        text = result.response.text().trim();
      } else {
        text =
          result?.response?.candidates?.[0]?.content?.parts
            ?.map(p => p.text)
            .join("\n")
            .trim() || "";
      }
    } catch (inner) {
      console.warn("Text extraction issue:", inner);
    }

    if (!text) {
      return res.status(502).json({ error: "Empty response from Gemini" });
    }

    res.json({ text });
  } catch (err) {
    console.error("Gemini API error:", err?.response?.data || err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model: MODEL_ID });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
