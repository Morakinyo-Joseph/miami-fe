import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  duration: number;
  onComplete: () => void;
}

export function ProgressBar({ duration, onComplete }: ProgressBarProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;

      if (remaining > 0) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(0);
        onComplete();
      }
    };

    requestAnimationFrame(updateProgress);
  }, [duration, onComplete]);

  return (
    <div className="h-1 bg-green-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}