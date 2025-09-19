import React, { createContext, useContext, useState } from "react";

const GeminiContext = createContext();

export const useGemini = () => useContext(GeminiContext);

export const GeminiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateContent = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      // Call your backend instead of Gemini directly
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        throw new Error(data.error);
      }

      return data.text;
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
