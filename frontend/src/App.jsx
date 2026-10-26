import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HowVerityWorks from "./components/HowVerityWorks";
import AnalyzeForm from "./components/AnalyzeForm";
import Metrics from "./components/Metrics";
import History from "./components/History";
import "./styles.css";

function App() {
  // ---- Metrics state ----
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // ---- History state ----
  const [history, setHistory] = useState([]);

  // Load metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch(
 
          `${import.meta.env.VITE_API_BASE_URL}/metrics`
         );
        if (!res.ok) throw new Error(`Failed to load metrics: ${res.status}`);
        const data = await res.json();
        const parsed = typeof data.metrics === "string" ? JSON.parse(data.metrics) : data.metrics;
        setMetrics(parsed);
      } catch (err) {
        setMetricsError(err.message);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("verityHistory");
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) {
      console.warn("Malformed history data in localStorage", e);
    }
  }, []);

  // Add a successful prediction to history
  const addToHistory = (record) => {
    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem("verityHistory", JSON.stringify(newHistory));
  };

  // Clear all history with confirmation
  const clearHistory = () => {
    if (window.confirm("Delete all prediction history? This cannot be undone.")) {
      setHistory([]);
      localStorage.removeItem("verityHistory");
    }
  };

  return (
    <div className="app">
      <Navbar />

      {/* Hero */}
      <section id="hero" className="hero-section">
        <h1>Verity – NLP Fake News Detector</h1>
        <p className="tagline">Pause. Check. Understand.</p>
      </section>

      {/* Analyze */}
      <section id="analyze" className="analyze-section">
        <h2>Analyze News</h2>
        <div className="analyze-container">
          <HowVerityWorks />
          <AnalyzeForm onPrediction={addToHistory} />
        </div>
      </section>

      {/* History */}
      <section id="history" className="history-section">
        <h2>Prediction History</h2>
        <History data={history} onClear={clearHistory} />
      </section>

      {/* Model Performance */}
      <section id="metrics" className="metrics-section">
        <h2>Model Performance</h2>
        {loadingMetrics && <p>Loading metrics…</p>}
        {metricsError && <p className="error">{metricsError}</p>}
        {metrics && <Metrics data={metrics} />}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <h2>How It Works</h2>
        <p>
          Verity uses a classic Natural Language Processing pipeline. Text is first
          cleaned and combined, then transformed into TF‑IDF n‑gram features. Three
          classifiers (Logistic Regression, Multinomial Naïve Bayes, Linear SVC) are
          trained on the provided dataset, and the model with the best validation
          F1‑score is selected. The final model is a scikit‑learn pipeline saved with
          <code>joblib</code> and served via FastAPI.
        </p>
        <p className="disclaimer">
          <strong>Responsible Use:</strong> This tool does **not** perform live
          fact‑checking. It classifies based on patterns learned from the training
          data and may produce inaccurate results on unseen domains. Treat the
          output as a suggestion, not a definitive truth.
        </p>
      </section>

      <footer className="footer">
        <p>© 2026 Verity • Built with React, Vite, FastAPI • No external APIs used.</p>
      </footer>
    </div>
  );
}

export default App;
