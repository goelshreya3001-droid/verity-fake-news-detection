import React, { useState, useEffect, useRef } from 'react';
import { PauseIcon, ActivityIcon, CheckCircleIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const steps = [
  {
    title: '01 — Pause',
    description: 'Headlines can be misleading. Start by examining the full story.',
    icon: <PauseIcon size={32} />,
  },
  {
    title: '02 — Analyze',
    description: 'Verity uses a trained machine learning model to analyze the text you provide.',
    icon: <ActivityIcon size={32} />,
  },
  {
    title: '03 — Verify',
    description: 'Review the prediction and cross-check the information with reliable sources.',
    icon: <CheckCircleIcon size={32} />,
  },
];

function HowVerityWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return; // disable auto cycle
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % steps.length);
      }, 4500);
    }
    return () => clearInterval(intervalRef.current);
  }, [paused, prefersReduced]);

  const goPrev = () => {
    setActive((prev) => (prev - 1 + steps.length) % steps.length);
  };
  const goNext = () => {
    setActive((prev) => (prev + 1) % steps.length);
  };

  return (
    <div
      className="how-verity-works"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="stepper">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`step ${idx === active ? 'active' : ''}`}
          >
            <div className="icon">{step.icon}</div>
            <div className="content">
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
        <div className="progress-indicator">
          Step {active + 1} of {steps.length}
        </div>
        <div className="controls">
          <button onClick={goPrev} aria-label="Previous step" className="ctrl-btn">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNext} aria-label="Next step" className="ctrl-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HowVerityWorks;
