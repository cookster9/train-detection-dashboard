"use client";

import { useEffect, useRef, useState } from "react";
import type { Detection } from "@/lib/supabase";

const POLL_INTERVAL_MS = 10_000; // 10 seconds — tweak as needed

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function DirectionBadge({ direction }: { direction: string | null }) {
  const d = direction?.toLowerCase() ?? "";
  const isNorth = d.includes("north") || d === "n" || d === "up";
  const isSouth = d.includes("south") || d === "s" || d === "down";

  return (
    <span
      className={`direction-badge ${isNorth ? "north" : isSouth ? "south" : "unknown"}`}
    >
      {isNorth ? "↑" : isSouth ? "↓" : "→"}{" "}
      {direction ?? "unknown"}
    </span>
  );
}

export default function DetectionFeed() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const prevIdsRef = useRef<Set<number>>(new Set());

  async function fetchDetections() {
    try {
      const res = await fetch("/api/detections?limit=50");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const incoming: Detection[] = json.detections ?? [];

      // Figure out which IDs are brand new since last fetch
      const fresh = new Set(
        incoming
          .map((d) => d.id)
          .filter((id) => !prevIdsRef.current.has(id))
      );

      if (fresh.size > 0) {
        setNewIds(fresh);
        setTimeout(() => setNewIds(new Set()), 2000); // fade out highlight
      }

      prevIdsRef.current = new Set(incoming.map((d) => d.id));
      setDetections(incoming);
      setStatus("ok");
      setLastUpdated(new Date());
    } catch (e: unknown) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
    }
  }

  useEffect(() => {
    fetchDetections();
    const interval = setInterval(fetchDetections, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const todayCount = detections.filter((d) => {
    const today = new Date().toDateString();
    return new Date(d.created_at).toDateString() === today;
  }).length;

  return (
    <div className="feed-container">
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{detections.length}</span>
          <span className="stat-label">loaded</span>
        </div>
        <div className="stat">
          <span className="stat-value">{todayCount}</span>
          <span className="stat-label">today</span>
        </div>
        <div className="stat-right">
          <span
            className={`status-dot ${
              status === "ok"
                ? "dot-ok"
                : status === "error"
                ? "dot-error"
                : "dot-loading"
            }`}
          />
          <span className="stat-label">
            {status === "loading"
              ? "connecting…"
              : status === "error"
              ? `error: ${errorMsg}`
              : lastUpdated
              ? `updated ${formatTime(lastUpdated.toISOString())}`
              : "live"}
          </span>
        </div>
      </div>

      {/* Table */}
      {status === "loading" && detections.length === 0 ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>Connecting to database…</p>
        </div>
      ) : detections.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">🚂</p>
          <p>No detections yet.</p>
          <p className="empty-sub">The Pi will populate this when trains pass.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Time</th>
                <th>Direction</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((d, i) => (
                <tr
                  key={d.id}
                  className={newIds.has(d.id) ? "row-new" : ""}
                >
                  <td className="col-index">{i + 1}</td>
                  <td className="col-date">{formatDate(d.created_at)}</td>
                  <td className="col-time">{formatTime(d.created_at)}</td>
                  <td>
                    <DirectionBadge direction={d.direction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="poll-note">Refreshes every {POLL_INTERVAL_MS / 1000}s</p>
    </div>
  );
}
