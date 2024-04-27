import { createClient } from "@/utils/supabase/server";

import { Song } from "@/types";

const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("songs")
    .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getSongsByUserId;
