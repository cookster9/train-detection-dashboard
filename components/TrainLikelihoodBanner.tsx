"use client";

import { useEffect, useState } from "react";

type Likelihood = "low" | "medium" | "high" | "unknown";

export default function TrainLikelihoodBanner() {
  const [likelihood, setLikelihood] = useState<Likelihood>("unknown");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/train-likelihood");
        if (!res.ok) throw new Error("Failed to load likelihood");
        const json = await res.json();
        setLikelihood((json?.likelihood as Likelihood) ?? "unknown");
      } catch (error) {
        console.error(error);
        setLikelihood("unknown");
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60_000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const colors = {
    low: { bg: "#1a3a0d", text: "#7cfc00", icon: "🟢" },
    medium: { bg: "#3a3000", text: "#f5c842", icon: "🟡" },
    high: { bg: "#2d1000", text: "#ff7043", icon: "🔴" },
    unknown: { bg: "#2a2a2a", text: "#c9c9c9", icon: "❓" },
  };

  const labels = {
    low: "Low likelihood of imminent crossing",
    medium: "Moderate likelihood of imminent crossing",
    high: "High likelihood of imminent crossing",
    unknown: "Likelihood unavailable",
  };

  const color = colors[likelihood];

  return (
    <div
      style={{
        background: color.bg,
        color: color.text,
        padding: "0.875rem 1rem",
        borderRadius: 4,
        marginBottom: "1rem",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>{loading ? "⏳" : color.icon}</span>
      <span>{loading ? "Checking likelihood…" : labels[likelihood]}</span>
    </div>
  );
}