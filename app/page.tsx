import DetectionFeed from "@/components/DetectionFeed";
import CrossingHeatMap from "@/components/CrossingHeatMap";
import CrossingLocationPanel from "@/components/CrossingLocationPanel";
import { getCrossing } from "@/lib/crossing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { crossing, error } = await getCrossing();

  if (error) {
    console.error("Failed to load crossing location:", error);
  }

  return (
    <main className="page">
      <header className="header">
        <p className="header-eyebrow">Raspberry Pi · Live Feed</p>
        <h1>Train Detector</h1>
        <p className="header-sub">
          Detections logged automatically as trains pass the sensor.
        </p>
        <hr className="header-rule" />
      </header>

      <CrossingLocationPanel crossing={crossing} error={error} />

      <section className="dashboard-grid">
        <div className="feed-panel">
          <DetectionFeed />
        </div>

        <div className="heatmap-panel">
          <h2>Crossing heat map</h2>
          <CrossingHeatMap />
        </div>
      </section>
    </main>
  );
}