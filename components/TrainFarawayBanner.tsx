"use client";

import { useEffect, useState } from "react";

interface TrainFarawayBannerProps {
  lastFarawayTime: Date | null;
  showDuration: number;
  suppressed?: boolean;
}

export default function TrainFarawayBanner({ lastFarawayTime, showDuration, suppressed = false }: TrainFarawayBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (suppressed) { setIsVisible(false); return; }
    if (!lastFarawayTime) { setIsVisible(false); return; }

    const now = Date.now();
    const elapsed = now - lastFarawayTime.getTime();

    if (elapsed < showDuration) {
      setIsVisible(true);
      const timeout = setTimeout(() => setIsVisible(false), showDuration - elapsed);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [lastFarawayTime, showDuration, suppressed]);

  if (!isVisible) return null;

  return (
    <div className="train-banner banner-faraway">
      <div className="banner-content">
        <span className="banner-emoji">⚠️</span>
        <div className="banner-text">
          <h3>Possible upcoming crossing</h3>
          <p>Faraway train sounds detected — a crossing may be approaching soon.</p>
        </div>
      </div>
    </div>
  );
}
