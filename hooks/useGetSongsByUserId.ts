import { Profile, Song } from "@/types"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useUser } from "./useUser"
import { createClient } from "@/utils/supabase/client"

const useGetSongsByUserId = (id?: string) => {

    const [ isLoading, setIsLoading ] = useState(false)

    const [ songs , setSongs ] = useState<Song[] | null>(null)

    const { user } = useUser()

    const supabase = createClient()

    useEffect(() => {

        if(!id) {
            return 
        }

        setIsLoading(true)

        const fetchUserSongs = async () => {
            const { data , error  } = await supabase
            .from('songs')
            .select('*')
            .eq('user_id', id)

            if ( error ) {
                setIsLoading(false)
                return toast.error(error.message)
            }

            setSongs(data as Song[])
            setIsLoading(false)
        }


        fetchUserSongs()

    }, [id, supabase])


    return useMemo(() => ({

        isLoading, 
        songs

    }), [isLoading, songs])


} 

export default useGetSongsByUserId

