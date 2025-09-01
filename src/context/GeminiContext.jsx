import React, { createContext, useContext, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiContext = createContext();

export const useGemini = () => useContext(GeminiContext);

export const GeminiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const generateContent = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      const result = await response.response;
      setLoading(false);
      return result.text();
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
      return null;
    }
  };

  return (
    <GeminiContext.Provider value={{ generateContent, loading, error }}>
      {children}
    </GeminiContext.Provider>
  );
};
