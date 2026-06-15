"use client";

import { useEffect, useState } from "react";

interface TrainDetectionBannerProps {
  lastCloseTime: Date | null;
  showDuration: number;
}

export default function TrainDetectionBanner({ lastCloseTime, showDuration }: TrainDetectionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!lastCloseTime) { setIsVisible(false); return; }

    const now = Date.now();
    const elapsed = now - lastCloseTime.getTime();

    if (elapsed < showDuration) {
      setIsVisible(true);
      const timeout = setTimeout(() => setIsVisible(false), showDuration - elapsed);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [lastCloseTime, showDuration]);

  if (!isVisible) return null;

  return (
    <div className="train-banner banner-active">
      <div className="banner-content">
        <span className="banner-emoji">🚂</span>
        <div className="banner-text">
          <h2>Train Detected!</h2>
          <p>A train is likely crossing the tracks right now.</p>
        </div>
      </div>
    </div>
  );
}