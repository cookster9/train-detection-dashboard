import DetectionFeed from "@/components/DetectionFeed";

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

      <DetectionFeed />
    </main>
  );
}
