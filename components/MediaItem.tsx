"use client"
import useLoadImage from '@/hooks/useLoadImage'
import { Song } from '@/types'
import Image from 'next/image'
import React from 'react'


interface MediaItemProps {
    onClick?: (id: string) => void
    song: Song
}

const MediaItem = (props : MediaItemProps) => {

    const { song, onClick } = props

    const imageUrl = useLoadImage(song)

    const handleClick = () => {

        if (onClick) {
            return onClick(song.id)
        }

        // turn on player default
    }


  return (
    <div
    onClick={handleClick}
    className='
    flex
    items-center
    gap-x-3
    cursor-pointer
    hover:bg-neutral-800/50
    w-full
    p-2
    rounded-md
    '
    >
        <div className='relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden'>
                <Image 
                fill 
                src={imageUrl || '/../public/images/liked.jpg'} 
                alt='media-item' 
                className='object-cover' 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
        </div>

        <div className='
            flex
            flex-col
            gap-y-1
            overflow-hidden
        '>
            <p className='text-white truncate'>
                {song?.title}
            </p>

            <p className='text-neutral-400 text-sm truncate'>
                {song?.author}
            </p>

        </div>

    </div>
  )
}

export default MediaItem