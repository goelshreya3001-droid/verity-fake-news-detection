import React, { useState } from 'react';
import { Trash2, Eye } from 'lucide-react';

function History({ data, onClear }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleDetails = (idx) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  if (!data || data.length === 0) {
    return <p className="history-empty">No predictions yet. Analyze news above to build your history.</p>;
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="clear-btn" onClick={onClear}>
          <Trash2 size={16} /> Clear History
        </button>
      </div>
      <div className="history-list">
        {data.map((item, idx) => (
          <div key={idx} className="history-card">
            <div className="card-summary">
              <div className="summary-left">
                <strong>{item.label}</strong> • {new Date(item.date).toLocaleString()}
              </div>
              <div className="summary-right">
                <button className="detail-btn" onClick={() => toggleDetails(idx)} aria-label="View details">
                  <Eye size={16} />
                </button>
              </div>
            </div>
            {expandedId === idx && (
              <div className="card-details">
                <p><strong>Headline:</strong> {item.headline}</p>
                <p><strong>Article:</strong> {item.article}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
