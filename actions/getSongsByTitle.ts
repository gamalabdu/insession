// import { createClient } from "@/utils/supabase/server";

// import { Song } from "@/types";
// import getSongs from "./getSongs";

// const getSongsByTitle = async (title: string): Promise<Song[]> => {

//   const supabase = createClient();

//   if (!title) {
//     const allSongs = await getSongs();

//     return allSongs;
//   }

//   const { data, error } = await supabase
//     .from("songs")
//     .select("*")
//     .ilike("title", `%${title}%`)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error.message);
//   }

//   return (data as any) || [];

// };

// export default getSongsByTitle;

import { createClient } from "@/utils/supabase/server";
import { Song } from "@/types";
import getSongs from "./getSongs";

const searchSongs = async (searchQuery: string): Promise<Song[]> => {
  const supabase = createClient();

  if (!searchQuery.trim()) {
    const allSongs = await getSongs();

    return allSongs;
  }

  // Properly constructing the OR query
  const formattedQuery = `
    title.ilike.%${searchQuery}%,
    bpm.ilike.%${searchQuery}%,
    key.ilike.%${searchQuery}%,
    username.ilike.%${searchQuery}%
  `.replace(/\s+/g, ""); // Removes whitespace which might cause issues

  const { data, error } = await supabase
    .from("songs")
    .select("*, genres(name)")
    .or(formattedQuery) // Apply the OR condition
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching songs:", error.message);
    return [];
  }

  if (data?.length > 0) {
    console.log("Fetched data:", data); // Log fetched data
  } else {
    console.log("No data matches the search criteria.");
  }

  return data || [];
};

export default searchSongs;
