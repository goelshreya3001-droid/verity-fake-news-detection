
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
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("verityHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load metrics from backend
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const API_URL = (
          import.meta.env.VITE_API_BASE_URL ||
          "https://verity-fake-news-detection.onrender.com"
        ).replace(/\/+$/, "");
        const res = await fetch(`${API_URL}/metrics`);
        const responseText = await res.text();

        if (!res.ok) {
          throw new Error(`Metrics request failed: ${res.status}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error("Backend returned invalid JSON for metrics.");
        }

        let parsedMetrics = data.metrics;
        if (typeof parsedMetrics === "string") {
          try {
            parsedMetrics = JSON.parse(parsedMetrics);
          } catch {
            throw new Error("Metrics data inside the response is invalid.");
          }
        }

        if (!parsedMetrics || typeof parsedMetrics !== "object") {
          throw new Error("Metrics data is missing or invalid.");
        }

        setMetrics(parsedMetrics);
        setMetricsError(null);
      } catch (err) {
        setMetricsError(err.message || "Could not load model metrics.");
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  // Add a successful prediction to history and persist it
  const addToHistory = (record) => {
    setHistory((previousHistory) => {
      const newHistory = [record, ...previousHistory];
      try {
        localStorage.setItem("verityHistory", JSON.stringify(newHistory));
      } catch (error) {
        console.error("Could not save history:", error);
      }
      return newHistory;
    });
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
          cleaned and combined, then transformed into TF-IDF n-gram features. Three
          classifiers (Logistic Regression, Multinomial Naïve Bayes, Linear SVC) are
          trained on the provided dataset, and the model with the best validation
          F1-score is selected. The final model is a scikit-learn pipeline saved with
          <code>joblib</code> and served via FastAPI.
        </p>
        <p className="disclaimer">
          <strong>Responsible Use:</strong> This tool does not perform live
          fact-checking. It classifies based on patterns learned from the training
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
