import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in backend/.env");
}

let genAI = null;
try {
  if (API_KEY) genAI = new GoogleGenerativeAI(API_KEY);
} catch (e) {
  console.error("Failed to init GoogleGenerativeAI:", e);
}

app.post("/api/generate", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "Gemini not initialized" });
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt required" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt.trim()]);
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!text) {
      return res.status(502).json({ error: "Empty response from Gemini" });
    }
    res.json({ text });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ error: err.message || "Generation failed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
