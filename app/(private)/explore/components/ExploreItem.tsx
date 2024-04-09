"use client"
import ProfileItem from '@/components/ProfileItem'
import useGetSongsByUserId from '@/hooks/useGetSongsByUserId'
import useLoadProfileImage from '@/hooks/useLoadProfileImage'
import useOnPlay from '@/hooks/useOnPlay'
import { Profile, Song } from '@/types'
import React, { useEffect } from 'react'


interface ExploreItemProps {
    currentUser: Profile
}

const ExploreItem = (props: ExploreItemProps) => {

    const { currentUser } = props 

    const imageUrl = useLoadProfileImage(currentUser)

    const { songs }  = useGetSongsByUserId(currentUser.id)


    const onPlay = useOnPlay(songs)


  return (
     <ProfileItem 
        song={songs[0]} 
        onClick={(id: string) => onPlay(id) } 
        key={songs[0]?.id } 
        profile={currentUser} 
        profileImageUrl={imageUrl || ''} 
     />
  )
}

export default ExploreItem