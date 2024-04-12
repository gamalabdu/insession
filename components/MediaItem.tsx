"use client"
import { Song } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'


interface MediaItemProps {
    onClick?: (id: string) => void
    song: Song
    isInLibrary?: boolean
}

const MediaItem = (props : MediaItemProps) => {

    const { song, onClick, isInLibrary } = props

    const router = useRouter()

    const goToProfile = () => {
        router.push(`/profile?id=${song.user_id}`);
    }

    const handleClick = () => {

        if (onClick) {
            return onClick(song.id)
        }

        // turn on player default
    }


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

        </div>
    }

    </div>
  )
}

export default MediaItem


