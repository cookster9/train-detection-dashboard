import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Matches the shape of rows in your `detections` table.
// Adjust field names to match your actual column names.
export type Detection = {
  id: number;
  created_at: string;       // Supabase default timestamp column
  direction: string | null; // e.g. "northbound" / "southbound"
  // Add any extra columns your Pi inserts here, e.g.:
  // confidence: number | null;
  // camera_id: string | null;
};
