import { supabase } from "@/lib/supabase";

export type Crossing = {
  fra_crossing_id: string;
  street: string;
  google_maps_url: string;
};

export type CrossingLookup = {
  crossing: Crossing | null;
  error: string | null;
};

export async function getCrossing(): Promise<CrossingLookup> {
  const { data, error } = await supabase
    .from("crossings")
    .select("fra_crossing_id, street, google_maps_url")
    .limit(1)
    .maybeSingle();

  if (error) {
    return { crossing: null, error: error.message };
  }

  return { crossing: data, error: null };
}
