
import { createClient } from "@/utils/supabase/server";
import { Song } from "@/types";

const getSongBySongId = async (song_id: string): Promise<Song> => {


  const supabase = createClient();


  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq('id', song_id)
    .order("created_at", { ascending: false })
    .returns<Song[]>()
    .single()

  if (error) {
    console.error("Error fetching songs:", error.message);
  }


  return data as Song;
};

export default getSongBySongId;