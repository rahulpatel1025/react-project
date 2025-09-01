import react from 'react'
import './index.css'
import App from './App.jsx'
import { GeminiProvider } from "./context/GeminiContext";
import ReactDOM from "react-dom/client";
ReactDOM.createRoot(document.getElementById("root")).render(
  <GeminiProvider>
    <App />
  </GeminiProvider>,
)
