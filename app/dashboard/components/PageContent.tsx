"use client"
import SongItem from '@/components/SongItem'
import useEditProfileModal from '@/hooks/useEditProfileModal'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useOnPlay from '@/hooks/useOnPlay'
import useProfileSetupModal from '@/hooks/useProfileSetupModal'
import { useUser } from '@/hooks/useUser'
import { Song } from '@/types'
import React, { useEffect } from 'react'
import Image from 'next/image'
import likedImaged from '../../../public/images/liked.jpg'

interface PageContentProps {
    songs: Song[]
    heroImage: string
}

const PageContent = (props : PageContentProps) => {

  const { songs, heroImage } = props 

  const onPlay = useOnPlay(songs)



  if(songs.length === 0) {
    return (
        <div className='mt-4 text-neutral-400'>
            No songs available.
        </div>
    )
  }


  return (

    <>

    <div className='mt-4 max-h-[300px] w-full flex flex-row rounded-md'>

    <div className='relative'>
      
      <div className="inset-0 h-full w-[350px]">

           <Image 
           height={500}
           width={1200}
          className="object-cover h-full rounded-md" 
          src={heroImage} 
          alt='source-image' 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900"></div>
    </div>


    <div className='ml-8 flex flex-nowrap overflow-x-auto p-4 gap-4'>
  {songs.map(song => (
    <div key={song.id} className='flex-shrink-0 w-48'>
      <SongItem key={song.id} onClick={(id: string) => onPlay(id)} song={song} />
    </div>
  ))}
</div>


</div>




<div className="flex justify-between items-center mt-4">
          
          <h1 className="text-white text-2xl font-semibold"> 
            Newest Songs
          </h1>

  </div>




    <div
      className='
        grid 
        grid-cols-2 
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-8
        gap-4
        mt-4
    '
    >
        {
            songs.map( (song) => {
                return <SongItem key={song.id} onClick={ (id : string) => onPlay(id) }  song={song} />
            })
        }
    </div>


    </>
  )

}

export default PageContent