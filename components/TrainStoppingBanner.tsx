"use client";

import { useEffect, useState } from "react";

interface TrainStoppingBannerProps {
  lastStoppingTime: Date | null;
  showDuration: number;
}

export default function TrainStoppingBanner({ lastStoppingTime, showDuration }: TrainStoppingBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!lastStoppingTime) { setIsVisible(false); return; }

    const now = Date.now();
    const elapsed = now - lastStoppingTime.getTime();

    if (elapsed < showDuration) {
      setIsVisible(true);
      const timeout = setTimeout(() => setIsVisible(false), showDuration - elapsed);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [lastStoppingTime, showDuration]);

  if (!isVisible) return null;

  return (
    <div className="train-banner banner-stopping">
      <div className="banner-content">
        <span className="banner-emoji">⚠️</span>
        <div className="banner-text">
          <h3>Stopping noises detected</h3>
          <p>Wheels squealing detected on the last crossing — the train may have been stopping. This note will remain for 30 minutes.</p>
        </div>
      </div>
    </div>
  );
}
