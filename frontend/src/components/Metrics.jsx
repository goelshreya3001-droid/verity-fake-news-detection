import React from 'react';

function Metrics({ data }) {
  // data shape: { selected_model, validation_metrics, test_metrics }
  const { selected_model, test_metrics } = data;
  if (!test_metrics) return <p>No metrics available.</p>;
  const { accuracy, precision, recall, f1, confusion_matrix, classification_report } = test_metrics;
  const cm = confusion_matrix || [];

  return (
    <div className="metrics">
      <h3>Best Model: {selected_model}</h3>
      <table className="metrics-table">
        <tbody>
          <tr><td>Accuracy</td><td>{(accuracy * 100).toFixed(2)}%</td></tr>
          <tr><td>Precision</td><td>{(precision * 100).toFixed(2)}%</td></tr>
          <tr><td>Recall</td><td>{(recall * 100).toFixed(2)}%</td></tr>
          <tr><td>F1‑Score</td><td>{(f1 * 100).toFixed(2)}%</td></tr>
        </tbody>
      </table>
      <h4>Confusion Matrix</h4>
      {cm.length === 0 ? (
        <p>Not available.</p>
      ) : (
        <table className="confusion-table">
          <thead>
            <tr>
              <th></th>
              <th>Predicted Fake</th>
              <th>Predicted Real</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Actual Fake</th>
              <td>{cm[0][0]}</td>
              <td>{cm[0][1]}</td>
            </tr>
            <tr>
              <th>Actual Real</th>
              <td>{cm[1][0]}</td>
              <td>{cm[1][1]}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Metrics;
