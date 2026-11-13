import type { Crossing } from "@/lib/crossing";

type CrossingLocationPanelProps = {
  crossing: Crossing | null;
  error?: string | null;
};

function getGoogleMapsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      url.protocol === "https:" &&
      url.hostname === "www.google.com" &&
      url.pathname.startsWith("/maps")
    ) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export default function CrossingLocationPanel({
  crossing,
  error = null,
}: CrossingLocationPanelProps) {
  const mapsUrl = crossing
    ? getGoogleMapsUrl(crossing.google_maps_url)
    : null;

  return (
    <section className="crossing-location" aria-labelledby="crossing-location-title">
      <div className="crossing-location-copy">
        <p className="crossing-location-eyebrow">Crossing location</p>
        <h2 id="crossing-location-title">
          {crossing?.street ?? "Location unavailable"}
        </h2>
        <p className="crossing-location-city">
          {crossing
            ? "Nashville, TN"
            : error
              ? `Could not load crossing details: ${error}`
              : "No crossing record found"}
        </p>
      </div>

      {crossing && (
        <div className="crossing-location-details">
          <span className="crossing-id">FRA {crossing.fra_crossing_id}</span>
          {mapsUrl && (
            <a
              className="crossing-map-link"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Google Maps
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                className="crossing-map-icon"
              >
                <path
                  d="M5 11 11 5M5.5 5H11v5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>
      )}
    </section>
  );
}
