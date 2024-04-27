
import { createClient } from "@/utils/supabase/server";

const getLikedArtistProfiles = async (): Promise<Profile[]> => {

  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();


  if (sessionError || !user) {
    console.error("Session error or user not found", sessionError?.message);
    return [];
  }

  // Adjust the query to perform a manual join by selecting from the profiles table
  // and using a subquery to filter profiles based on artist_id in the liked_artist table
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in(
      "id",
      await supabase
        .from("liked_artist")
        .select("artist_id")
        .eq("user_id", user.id)
        // Convert the artist_id selection into an array of IDs
        .then(({ data }) => data?.map((item) => item.artist_id) || [])
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching liked artist profiles", error.message);
    return [];
  }

  return data || [];
};

export default getLikedArtistProfiles;
