import type { Detection } from "@/lib/supabase";

type Props = {
  stoppingEvents: Detection[];
  showDuration: number;
};

function formatTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function TrainStoppingBanner({ stoppingEvents, showDuration }: Props) {
  const count = stoppingEvents.length;
  if (count === 0) {
    return (
      <div className="banner stopping-banner stopping-none">
        <strong>No recent stopping events</strong>
      </div>
    );
  }

  // assume detections include a numeric `score` field for squeal loudness
  const maxScore = stoppingEvents.reduce((m, e) => {
    const s = typeof (e as any).score === "number" ? (e as any).score : 0;
    return Math.max(m, s);
  }, 0);

  const last = stoppingEvents[0];

  return (
    <div className="banner stopping-banner">
      <div className="banner-title">Stopping events</div>
      <div className="banner-body">
        <div>{count} in last {Math.round(showDuration / 1000)}s</div>
        <div>Max squeal score: {Math.round(maxScore * 100) / 100}</div>
        <div>Last: {formatTime(last?.created_at)}</div>
      </div>
    </div>
  );
}
