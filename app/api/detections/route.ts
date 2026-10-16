import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // never cache — always fresh

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "50");

  const [{ data, error }, { data: todayCount, error: todayCountError }] =
    await Promise.all([
      supabase
        .from("detections")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit),
      supabase.rpc("get_today_crossing_count"),
    ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (todayCountError) {
    return NextResponse.json({ error: todayCountError.message }, { status: 500 });
  }

  if (
    typeof todayCount !== "number" ||
    !Number.isSafeInteger(todayCount) ||
    todayCount < 0
  ) {
    return NextResponse.json(
      { error: "Invalid today count returned by Supabase" },
      { status: 500 }
    );
  }

  return NextResponse.json({ detections: data, todayCount });
}
