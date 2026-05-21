"use client";

import { useEffect, useState } from "react";

interface TrainDetectionBannerProps {
  lastDetectionTime: Date | null;
  showDuration: number; // milliseconds, e.g., 60000 for 60 seconds
}

export default function TrainDetectionBanner({
  lastDetectionTime,
  showDuration,
}: TrainDetectionBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!lastDetectionTime) {
      setIsVisible(false);
      return;
    }

    const now = new Date();
    const timeSinceDetection = now.getTime() - lastDetectionTime.getTime();

    if (timeSinceDetection < showDuration) {
      setIsVisible(true);
      // Schedule hiding after the remaining duration
      const timeoutMs = showDuration - timeSinceDetection;
      const timeout = setTimeout(() => setIsVisible(false), timeoutMs);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [lastDetectionTime, showDuration]);

  if (!isVisible) return null;

  return (
    <div className="train-banner">
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