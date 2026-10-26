
import React, { useState } from 'react';
import PredictionCard from './PredictionCard';

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://verity-fake-news-detection.onrender.com'
).replace(/\/+$/, '');

function AnalyzeForm({ onPrediction }) {
  const [headline, setHeadline] = useState('');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ headline, article }),
      });

      // Read the response body only once.
      const responseText = await res.text();

      let data = {};
      if (responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Backend returned an invalid response (HTTP ${res.status}). Please try again.`
          );
        }
      }

      if (!res.ok) {
        const detail = data.detail || data.error;
        throw new Error(
          typeof detail === 'string'
            ? detail
            : `Request failed (HTTP ${res.status}).`
        );
      }

      if (!responseText.trim()) {
        throw new Error('Backend returned an empty response. Please try again.');
      }

      if (!data.label) {
        throw new Error('Prediction was missing from the backend response.');
      }

      setResult(data);

      if (typeof onPrediction === 'function') {
        onPrediction({
          headline,
          article,
          label: data.label,
          date: new Date().toISOString(),
        });
      }
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Could not connect to the backend. Check your internet connection or try again shortly.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const charCount = `${headline.length + article.length} characters`;

  return (
    <div className="analyze-form">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Headline
          <input
            type="text"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
              setResult(null);
              setError(null);
            }}
            placeholder="Enter headline"
            required
          />
        </label>

        <label>
          Article Text
          <textarea
            rows={8}
            value={article}
            onChange={(e) => {
              setArticle(e.target.value);
              setResult(null);
              setError(null);
            }}
            placeholder="Enter full article text"
            required
          />
        </label>

        <div className="form-footer">
          <span className="char-counter">{charCount}</span>
          <div className="buttons" style={{ gap: '12px' }}>
            <button
              type="reset"
              onClick={() => {
                setHeadline('');
                setArticle('');
                setResult(null);
                setError(null);
              }}
            >
              Clear
            </button>

            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </div>
        </div>
      </form>

      {loading && <p className="loading">Analyzing…</p>}
      {error && <p className="error">{error}</p>}
      {result && <PredictionCard result={result} />}
    </div>
  );
}

export default AnalyzeForm;
