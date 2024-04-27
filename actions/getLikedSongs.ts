import { createClient } from "@/utils/supabase/server";

import { Song } from "@/types";

const getLikedSongs = async (): Promise<Song[]> => {
  
  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("liked_songs")
    // .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
    .select('*')
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};

export default getLikedSongs;
