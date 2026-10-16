import { beforeEach, describe, expect, it, vi } from "vitest";

const supabase = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({ supabase }));

import { GET } from "./route";

describe("GET /api/detections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the full today count independently of the limited detection list", async () => {
    const detections = [{ id: "detection-1", label: "train_close" }];
    const query = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: detections, error: null }),
    };
    supabase.from.mockReturnValue(query);
    supabase.rpc.mockResolvedValue({ data: 42, error: null });

    const response = await GET(
      new Request("http://localhost/api/detections?limit=20")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ detections, todayCount: 42 });
    expect(supabase.rpc).toHaveBeenCalledWith("get_today_crossing_count");
    expect(query.limit).toHaveBeenCalledWith(20);
  });
});
