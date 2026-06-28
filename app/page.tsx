import DetectionFeed from "@/components/DetectionFeed";
import CrossingHeatMap from "@/components/CrossingHeatMap";
import TrainLikelihoodBanner from "@/components/TrainLikelihoodBanner"

export default function Home() {
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