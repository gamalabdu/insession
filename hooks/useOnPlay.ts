// import { Song } from "@/types"
// import usePlayer from "./usePlayer"


// const useOnPlay = (songs : Song[] ) => {

    
//     const player = usePlayer()

//     const onPlay = ( id: string ) => {

//         player.setId(id)
//         player.setIds( songs.map( (song) => song.id ) )

//     }


//         return onPlay

// }


// export default useOnPlay





import { Song } from "@/types";
import usePlayer from "./usePlayer";

// Update the type to allow either a single song or an array of songs
const useOnPlay = (songs: Song | Song[]) => {
    
    const player = usePlayer();

    // Convert single song to array if it's not already an array
    const songsArray = Array.isArray(songs) ? songs : [songs];

    const onPlay = (id: string) => {
        player.setId(id);
        // Map through the array whether it's one or many songs
        player.setIds(songsArray.map(song => song.id));
    };

    return onPlay;
};

export default useOnPlay;