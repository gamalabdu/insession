import { Song } from "@/types"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"

const useGetSongById = (id?: string) => {

    const [ isLoading, setIsLoading ] = useState(false)

    const [ song, setSong ] = useState<Song | undefined>(undefined)

    const supabase = createClient()

    useEffect(() => {

        if(!id) {
            return 
        }

        setIsLoading(true)

        const fetchSong = async () => {
            const { data , error  } = await supabase
            .from('songs')
            .select("*, genres(name), owner:profiles!songs_user_id_fkey(username)")
            .eq('id', id)
            .single()

            if ( error ) {
                setIsLoading(false)
                return toast.error(error.message)
            }

            setSong(data as Song)
            setIsLoading(false)
        }


        fetchSong()

    }, [id, supabase])


    return useMemo(() => ({

        isLoading, 
        song

    }), [isLoading, song])


} 

export default useGetSongById

