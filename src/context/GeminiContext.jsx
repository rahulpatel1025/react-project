import React, { createContext, useContext, useState, useCallback } from "react";

const GeminiContext = createContext(null);

export const useGemini = () => {
  const ctx = useContext(GeminiContext);
  if (!ctx) throw new Error("useGemini must be used inside GeminiProvider");
  return ctx;
};

const API_BASE =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5000";

export function GeminiProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = useCallback(async (prompt) => {
    setError(null);
    if (!prompt || !prompt.trim()) return "";
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data.text || "";
    } catch (e) {
      setError(e);
      return "";
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <GeminiContext.Provider value={{ generateContent, loading, error }}>
      {children}
    </GeminiContext.Provider>
  );
}
