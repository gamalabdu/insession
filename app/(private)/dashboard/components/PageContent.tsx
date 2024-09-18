"use client"
import SongItem from '@/components/SongItem'
import useOnPlay from '@/hooks/useOnPlay'
import { Song } from '@/types'
import React, { useState } from 'react'
import Image from 'next/image'
import ProfileItem from '@/components/ProfileItem'
import ExploreItem from '../../explore/components/ExploreItem'
import { useUser } from '@/hooks/useUser'
import Button from '@/components/Button'
import useUploadModal from '@/hooks/useUploadModal'
import MediaItem from '@/components/MediaItem'
import LikeButton from '@/components/LikeButton'

interface PageContentProps {
    songs: Song[]
    userProfileInfo: Profile
    allUsers: Profile[]
}

const PageContent = (props : PageContentProps) => {

  const { songs, userProfileInfo, allUsers } = props 

  const { user } = useUser()

  const uploadModal = useUploadModal()


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


      
    <div className="flex justify-between items-center">

        <h1 className="text-white text-2xl font-semibold">
          {userProfileInfo.username}'s Portfolio
        </h1>

        { user?.id === userProfileInfo.id && 
          <Button className='w-[150px]' onClick={uploadModal.onOpen}> Edit Songs </Button>
        }

    </div>


 

    <div className="mt-2 mb-2 flex flex-col flex-nowrap overflow-x-auto p-4 gap-4 h-[350px]">

          {
            songs.filter((song => song.type === "profile")).map((song) => (

            // <div key={song.id} className="flex-shrink-0 w-48">
            //   <SongItem
            //     key={song.id}
            //     onClick={(id: string) => onPlay(id)}
            //     song={song}
            //   />
            // </div>

          <div key={song.id} className="flex items-center gap-x-4 w-full">

            <div className="flex-1">
              <MediaItem onClick={(id: string) => onPlay(id)} song={song} />
            </div>

            <LikeButton songId={song.id} />
             
          </div>
          ))}

    </div>






       
      

      


      <div className="flex justify-between items-center">

      <h1 className="text-white text-2xl font-semibold">
        {userProfileInfo.username}'s Shop
      </h1>

      </div>


      <div className="mt-4 max-h-[300px] w-full flex flex-row rounded-md">


        <div className="relative">
          <div className="inset-0 h-full w-[350px]"> 
            <Image
              height={500}
              width={1200}
              priority
              className="object-cover h-full rounded-md"
              src={userProfileInfo.avatar_url}
              alt="source-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-900"></div>
        </div>

        <div className="ml-8 flex flex-nowrap overflow-x-auto p-4 gap-4">
          {songs.filter((song => song.type != 'profile')).map((song) => (
            <div key={song.id} className="flex-shrink-0 w-48">
              <SongItem
                key={song.id}
                onClick={(id: string) => onPlay(id)}
                song={song}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h1 className="text-white text-2xl font-semibold">Newest Songs</h1>
      </div>

      <div
        className="
        grid 
        grid-cols-2 
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-8
        gap-4
        mt-4
    "
      >
        {songs.filter(song => song.type != 'profile').map((song) => {
          return (
            <SongItem  
              key={song.id}
              onClick={(id: string) => onPlay(id)}
              song={song}
            />
          );
        })}
      </div>




      <div className="flex justify-between items-center mt-4">
        <h1 className="text-white text-2xl font-semibold">Collaborators</h1>
      </div>

      <div
        className="
        grid 
        grid-cols-2 
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-8
        gap-4
        mt-4
    "
      >
        {allUsers.map((user, idx) => {
          return (
            <ExploreItem
              key={idx}
              currentUser={user}
            />
          )
        })}
      </div>


    


    </>
  );

}

export default PageContent