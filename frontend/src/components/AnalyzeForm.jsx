import React, { useState } from 'react';
import PredictionCard from './PredictionCard';

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
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, article }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
      if (onPrediction && typeof onPrediction === 'function') {
        const record = {
          headline,
          article,
          label: data.label,
          date: new Date().toISOString(),
        };
        onPrediction(record);
      }
    } catch (err) {
      setError(err.message);
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
            <button type="reset" onClick={() => { setHeadline(''); setArticle(''); setResult(null); setError(null); }}>Clear</button>
            <button type="submit" disabled={loading}>Analyze</button>
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
