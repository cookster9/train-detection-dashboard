import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Likelihood = "low" | "medium" | "high" | "unknown";

export async function GET() {
  try {
    const now = new Date();
    const centralNow = new Date(
      now.toLocaleString("en-US", { timeZone: "America/Chicago" })
    );
    const currentHour = centralNow.getHours();
    const currentMinuteBucket = Math.floor(centralNow.getMinutes() / 15) * 15;

    const { data: results, error } = await supabase.rpc("get_train_likelihood");

    if (error) {
      throw error;
    }

    const rows = (results ?? []) as Array<{
      hour_ct: number;
      bucket_15min: number;
      count: number;
    }[]>;

    if (rows.length === 0) {
      return NextResponse.json({
        likelihood: "unknown" as Likelihood,
        currentCount: 0,
        avgCount: 0,
      });
    }

    const currentBucketData = rows.find(
      (r) => r.hour_ct === currentHour && r.bucket_15min === currentMinuteBucket
    );
    const currentCount = currentBucketData?.count ?? 0;
    const avgCount = rows.reduce((sum, r) => sum + r.count, 0) / rows.length;

    let likelihood: Likelihood = "unknown";
    if (currentCount >= avgCount * 1.6) {
      likelihood = "high";
    } else if (currentCount >= avgCount * 0.7) {
      likelihood = "medium";
    } else if (avgCount > 0) {
      likelihood = "low";
    }

    return NextResponse.json({ likelihood, currentCount, avgCount });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { likelihood: "unknown", error: "Failed to calculate likelihood" },
      { status: 500 }
    );
  }
}