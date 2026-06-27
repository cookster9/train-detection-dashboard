"use client";

import { useEffect, useMemo, useState } from "react";

type DetectionEvent = {
  id: string;
  label: string;
  created_at: string;
  [key: string]: any;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);

export default function CrossingHeatMap() {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/detections?limit=1000");
        if (!res.ok) throw new Error("Failed to load detections");
        const json = await res.json();
        setEvents(json?.detections ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const matrix = useMemo(() => {
    const buckets = new Map<string, number>();
    const seen = new Set<string>();

    events
      .filter((event) => event.label === "train_close") // || event.label === "train_faraway")
      .forEach((event) => {
        const date = new Date(event.created_at);
        if (Number.isNaN(date.valueOf())) return;

        const minuteKey = `${date.getDay()}-${date.getHours()}-${date.getMinutes()}`;
        if (seen.has(minuteKey)) return;
        seen.add(minuteKey);

        const hourKey = `${date.getDay()}-${date.getHours()}`;
        buckets.set(hourKey, (buckets.get(hourKey) ?? 0) + 1);
      });

    return Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => buckets.get(`${day}-${hour}`) ?? 0)
    );
  }, [events]);

  const maxCount = Math.max(...matrix.flat(), 1);

  return (
    <div className="heatmap">
      {loading ? (
        <p>Loading heat map…</p>
      ) : (
        <>
          <div className="heatmap-grid">
            {matrix.map((row, day) => (
              <div key={day} className="heatmap-row">
                <span className="heatmap-day">{DAY_LABELS[day]}</span>
                {row.map((count, hour) => {
                  const alpha = Math.max(0.08, count / maxCount);
                  return (
                    <div
                      key={hour}
                      className="heatmap-cell"
                      style={{ backgroundColor: `rgba(18, 78, 220, ${alpha})` }}
                      title={`${count} crossing${count === 1 ? "" : "s"} at ${HOUR_LABELS[hour]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <p className="heatmap-note">
            Events are collapsed by minute to avoid repeated `train_close` spikes.
          </p>
        </>
      )}
    </div>
  );
}