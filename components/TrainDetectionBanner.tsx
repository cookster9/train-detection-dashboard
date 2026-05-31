"use client";

import { useEffect, useState } from "react";

type BannerState = "active" | "warning" | "gone" | "hidden";

interface TrainDetectionBannerProps {
  lastCloseTime: Date | null;
  lastFarawayTime: Date | null;
  warningAfterMs?: number;
  goneDismissAfterMs?: number;
  approachingDismissAfterMs?: number; // default 60s
}

export default function TrainDetectionBanner({
  lastCloseTime,
  lastFarawayTime,
  warningAfterMs = 5 * 60 * 1000,
  goneDismissAfterMs = 15_000,
  approachingDismissAfterMs = 60_000,
}: TrainDetectionBannerProps) {
  const [bannerState, setBannerState] = useState<BannerState>("hidden");
  const [showApproaching, setShowApproaching] = useState(false);

  // Main banner state logic (unchanged)
  useEffect(() => {
    if (!lastCloseTime) {
      setBannerState("hidden");
      return;
    }

    const now = Date.now();
    const closeTime = lastCloseTime.getTime();
    const farawayTime = lastFarawayTime?.getTime() ?? null;

    if (farawayTime && farawayTime > closeTime) {
      const msSinceFaraway = now - farawayTime;
      if (msSinceFaraway < goneDismissAfterMs) {
        setBannerState("gone");
        const timeout = setTimeout(() => setBannerState("hidden"), goneDismissAfterMs - msSinceFaraway);
        return () => clearTimeout(timeout);
      } else {
        setBannerState("hidden");
        return;
      }
    }

    const msSinceClose = now - closeTime;
    if (msSinceClose >= warningAfterMs) {
      setBannerState("warning");
      return;
    }

    setBannerState("active");
    const timeout = setTimeout(() => setBannerState("warning"), warningAfterMs - msSinceClose);
    return () => clearTimeout(timeout);
  }, [lastCloseTime, lastFarawayTime, warningAfterMs, goneDismissAfterMs]);

  // Approaching popup — faraway with no active close event
  useEffect(() => {
    if (!lastFarawayTime) return;

    const now = Date.now();
    const farawayTime = lastFarawayTime.getTime();
    const closeTime = lastCloseTime?.getTime() ?? null;

    // Only trigger if this faraway is NOT part of an active close event
    const isStandalonefaraway = !closeTime || farawayTime < closeTime;
    if (!isStandalonefaraway) return;

    const msSinceFaraway = now - farawayTime;
    if (msSinceFaraway >= approachingDismissAfterMs) return;

    setShowApproaching(true);
    const timeout = setTimeout(() => setShowApproaching(false), approachingDismissAfterMs - msSinceFaraway);
    return () => clearTimeout(timeout);
  }, [lastFarawayTime, lastCloseTime, approachingDismissAfterMs]);

  // If main banner is active, suppress the approaching popup — it's redundant
  const displayApproaching = showApproaching && bannerState === "hidden";

  const bannerConfig = {
    active:  { emoji: "🚂", heading: "Train Detected!",       body: "A train is likely crossing the tracks right now.", className: "banner-active" },
    warning: { emoji: "⚠️", heading: "Train May Be Stopped",  body: "No all-clear yet. The crossing may still be blocked.", className: "banner-warning" },
    gone:    { emoji: "✅", heading: "Crossing Clear",         body: "The train appears to have passed.", className: "banner-gone" },
  } as const;

  return (
    <>
      {bannerState !== "hidden" && (
        <div className={`train-banner ${bannerConfig[bannerState].className}`}>
          <div className="banner-content">
            <span className="banner-emoji">{bannerConfig[bannerState].emoji}</span>
            <div className="banner-text">
              <h2>{bannerConfig[bannerState].heading}</h2>
              <p>{bannerConfig[bannerState].body}</p>
            </div>
          </div>
        </div>
      )}

      {displayApproaching && (
        <div className="train-banner banner-approaching">
          <div className="banner-content">
            <span className="banner-emoji">👂</span>
            <div className="banner-text">
              <h2>Train May Be Approaching</h2>
              <p>A distant horn was detected. A train may be headed toward the crossing.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}