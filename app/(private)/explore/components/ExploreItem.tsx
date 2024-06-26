"use client"
import ProfileItem from '@/components/ProfileItem'
import useGetSongsByUserId from '@/hooks/useGetSongsByUserId'
import useOnPlay from '@/hooks/useOnPlay'
import React, { useEffect } from 'react'


interface ExploreItemProps {
    currentUser: Profile
}

const ExploreItem = (props: ExploreItemProps) => {

    const { currentUser } = props 

    const { songs }  = useGetSongsByUserId(currentUser.id)


    const onPlay = useOnPlay(songs)


  return (
     <ProfileItem 
        song={songs[0]} 
        onClick={(id: string) => onPlay(id) } 
        key={songs[0]?.id } 
        profile={currentUser} 
     />
  )
}

export default ExploreItem