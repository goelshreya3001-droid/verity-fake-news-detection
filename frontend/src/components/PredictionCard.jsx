import React from 'react';

function PredictionCard({ result }) {
  // result: { label: "Fake"|"Real", prediction: 0|1 }
  const { label, prediction } = result;
  const isReal = prediction === 1;
  const cardClass = isReal ? 'prediction-card real' : 'prediction-card fake';
  return (
    <div className={cardClass}>
      <h3>Prediction Result</h3>
      <p className="label">{label} News</p>
      <p className="note">The model provides a categorical label only; no confidence score is available.</p>
    </div>
  );
}

export default PredictionCard;
