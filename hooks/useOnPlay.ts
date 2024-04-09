import { Song } from "@/types"
import usePlayer from "./usePlayer"
import toast from "react-hot-toast"


const useOnPlay = (songs : Song[] ) => {

    
    const player = usePlayer()

    const onPlay = ( id: string ) => {

        player.setId(id)
        player.setIds( songs.map( (song) => song.id ) )

    }


        return onPlay

}


export default useOnPlay