import { createClient } from "@/utils/supabase/server";

import { Song } from "@/types";

const getSongs = async (): Promise<Song[]> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getSongs;
