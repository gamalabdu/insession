import { Song } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (song: Song) => {


    const supabase = createClient()

    if ( !song ) {
        return ''
    }

    const { data: songData } = supabase
    .storage
    .from('songs')
    .getPublicUrl(song.song_path)


    return songData.publicUrl

}

export default useLoadSongUrl