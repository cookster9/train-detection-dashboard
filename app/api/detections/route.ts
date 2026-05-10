import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // never cache — always fresh

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? "50");

  const { data, error } = await supabase
    .from("detections")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ detections: data });
}
