"use client"
import ProfileItem from '@/components/ProfileItem'
import useGetSongsByUserId from '@/hooks/useGetSongsByUserId'
import useLoadProfileImage from '@/hooks/useLoadProfileImage'
import useOnPlay from '@/hooks/useOnPlay'
import { Profile, Song } from '@/types'
import { useRouter } from 'next/navigation'
import router from 'next/router'
import React, { useEffect } from 'react'
import qs  from 'query-string'

interface ExploreItemProps {
    currentUser: Profile
}

const ExploreItem = (props: ExploreItemProps) => {

    const { currentUser } = props 

    const imageUrl = useLoadProfileImage(currentUser)

    const { songs }  = useGetSongsByUserId(currentUser.id)

    let userSongs : Song[] = []

    if(songs !== null) {
        userSongs = songs
    }

    const onPlay = useOnPlay(userSongs)


  return (
     <ProfileItem 
        song={userSongs[0]} 
        onClick={(id: string) => onPlay(id) } 
        key={userSongs[0]?.id } 
        profile={currentUser} 
        profileImageUrl={imageUrl || ''} 
     />
  )
}

export default ExploreItem