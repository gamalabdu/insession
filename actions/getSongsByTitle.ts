
import { createClient } from "@/utils/supabase/server";
import { Song } from "@/types";
import getSongs from "./getSongs";

const searchSongs = async (searchQuery: string): Promise<Song[]> => {

  const supabase = createClient()

  if ( !searchQuery ) {  // Trim to handle cases where searchQuery is just whitespace
    const allSongs = await getSongs()
    return allSongs
  }

  // Properly constructing the OR query
  const formattedQuery = `title.ilike.%${encodeURIComponent(searchQuery)}%` +
                         `,bpm.ilike.%${encodeURIComponent(searchQuery)}%` +
                         `,key.ilike.%${encodeURIComponent(searchQuery)}%`;

  const { data, error } = await supabase
    .from("songs")
    .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
    .or(formattedQuery.replace(/\s+/g, '')) // Ensure to remove any unintended whitespace
    .returns<Song[]>()
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching songs:", error.message)
    return [];
  }

  if (data?.length > 0) {
    console.log("Fetched data:", data)
  } else {
    console.log("No data matches the search criteria.")
  }

  return data as Song[] || [];

}

export default searchSongs;

