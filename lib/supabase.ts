import { createClient } from "@supabase/supabase-js";
import { UUID } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Matches the shape of rows in your `detections` table.
// Adjust field names to match your actual column names.
export type Detection = {
  id: UUID;
  created_at: string;       // use supabase generated timestamp
  label: string | null; // train_close, train_faraway, train_interference
  score: number | null; // Add any extra columns your Pi inserts here, e.g.:
  // confidence: number | null;
  // camera_id: string | null;
};
