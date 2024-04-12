"use client"
import useLoadImage from '@/hooks/useLoadImage'
import { Profile, Song } from '@/types'
import Image from 'next/image'
import React from 'react'
import PlayButton from './PlayButton'

interface SongItemProps {
    song: Song
    onClick: ( id: string ) => void
}

const SongItem = (props : SongItemProps) => {

    const { song, onClick } = props 

  return (
    <div
    onClick={ () => onClick(song.id) }
    className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3 h-full' 
    >
        <div className='relative aspect-square w-full h-full rounded-md overflow-hidden'>
            <Image 
                className='object-cover' 
                fill 
                src={song.image_path || '/./../public/images/liked.jpg'} 
                alt={'image'} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
        </div>

        <div className='flex flex-col items-start w-full pt-4 gap-y-1'>

            <p className='font-semibold truncate w-full'>
                {song?.title}
            </p>

            <p className='text-neutral-400 text-sm pb-4 w-full truncate'>
                By {song?.username}
            </p>

        </div>

        <div className='absolute bottom-24 right-5'>
            <PlayButton/>
        </div>

    </div>
  )
}

export default SongItem