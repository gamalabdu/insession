import { Song } from "@/types";
import { createClient } from "@/utils/supabase/server";
import getUserProfileInfo from "./getUserProfileInfo";


const getSongs = async (): Promise<Song[]> => {
  
  const supabase = createClient();

  const userProfile = await getUserProfileInfo()

  const { data, error } = await supabase
    .from("songs")
    .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
    .neq("user_id", userProfile.id)
    .returns<Song[]>()
    .order("created_at", { ascending: false });

  if (error) {
    console.log({ error });
    console.log(error.message);
  }

  return (data as Song[]) || [];
};

export default getSongs;
