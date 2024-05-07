import { createClient } from "@/utils/supabase/server";

import { Song } from "@/types";

const getSongsByUserId = async (user_id?: string): Promise<Song[]> => {

  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("songs")
    .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
    .eq("user_id", user_id ? user_id : user?.id)
    .returns<Song[]>()
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as Song[]) || [];
};

export default getSongsByUserId;
