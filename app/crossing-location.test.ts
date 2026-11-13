import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({
  from: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({ supabase }));

import CrossingLocationPanel from "@/components/CrossingLocationPanel";
import { getCrossing } from "@/lib/crossing";

describe("crossing location", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the crossing details from Supabase", async () => {
    const crossing = {
      fra_crossing_id: "350175T",
      street: "DOUGLAS AVENUE",
      google_maps_url: "https://www.google.com/maps/place/36.1935047,-86.7550428",
    };
    const query = {
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: crossing, error: null }),
    };
    supabase.from.mockReturnValue(query);

    await expect(getCrossing()).resolves.toEqual({ crossing, error: null });
    expect(supabase.from).toHaveBeenCalledWith("crossings");
    expect(query.select).toHaveBeenCalledWith(
      "fra_crossing_id, street, google_maps_url"
    );
    expect(query.limit).toHaveBeenCalledWith(1);
  });

  it("reports Supabase lookup errors instead of hiding them", async () => {
    const query = {
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "permission denied for table crossings" },
      }),
    };
    supabase.from.mockReturnValue(query);

    await expect(getCrossing()).resolves.toEqual({
      crossing: null,
      error: "permission denied for table crossings",
    });
  });

  it("shows Nashville, the FRA ID, and a secure Google Maps link", () => {
    const html = renderToStaticMarkup(
      createElement(CrossingLocationPanel, {
        crossing: {
          fra_crossing_id: "350175T",
          street: "DOUGLAS AVENUE",
          google_maps_url:
            "https://www.google.com/maps/place/36.1935047,-86.7550428",
        },
      })
    );

    expect(html).toContain("DOUGLAS AVENUE");
    expect(html).toContain("Nashville, TN");
    expect(html).toContain("FRA 350175T");
    expect(html).toContain('href="https://www.google.com/maps/place/36.1935047,-86.7550428"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
