"use client"
import { Song } from '@/types'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'


interface MediaItemProps {
    onClick?: (id: string) => void
    song: Song
    isInLibrary?: boolean
}

type SongGenres = {
    song_id : string,
    genres: string[]
}

const MediaItem = (props : MediaItemProps) => {

    const { song, onClick, isInLibrary } = props

    const router = useRouter()

    const supabase = createClient()

    const [ songGenres, setSongGenres ] = useState<SongGenres[]>([])


    const goToProfile = () => {
        router.push(`/profile?id=${song.user_id}`);
    }

    const handleClick = () => {

        if (onClick) {
            return onClick(song.id)
        }

        // turn on player default
    }


    useEffect(() => {

        async function fetchGenresForSong() {
            
            try {
                const { data, error } = await supabase
                .rpc('get_song_genres', { p_song_id: song.id });
    
                if (error) {
                    console.error('Error fetching song genres:', error.message);
                    return;
                }
    
                if (data) {
                    console.log(data);
                    setSongGenres(data);
                }
            } catch (error) {
                console.error('Fetching error:', error);
            }
        }
    
        fetchGenresForSong();

    }, [song.id, supabase]);
    
    



    console.log(songGenres)
    


  return (
    <div
    onClick={handleClick}
    className='flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md'>


        <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden'>
                <Image 
                fill 
                src={song.image_path} 
                alt='media-item' 
                className='object-cover' 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
        </div>

        {/* overflow-hidden */}
        <div className='
            flex
            flex-col
            gap-y-1
            w-[100px]
        '>
            <p className='text-white truncate'>
                {song?.title}
            </p>

            <p className='text-neutral-400 text-sm truncate hover:underline' onClick={goToProfile}>
                {song?.username}
            </p>

        </div>


     { 

     !isInLibrary &&

        <div className='flex flex-grow justify-evenly h-full'>

           <span className='text-neutral-400'>{song.key}</span>

           <span className='text-neutral-400'>{song.bpm}</span>

           <span className='text-neutral-400'>{song.duration}</span>

         {
            songGenres?.length > 0 &&

            <span className='text-neutral-400 truncate'>
            {songGenres.map(genre => genre.genres)}
            </span>
         }


        </div>
    }

    </div>
  )
}

export default MediaItem


