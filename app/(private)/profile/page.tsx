
import React from 'react'
import ProfilePageContent from './components/ProfilePage'
import getUserProfileById from '@/actions/getUserProfileById'
import getSongsByUserId from '@/actions/getSongsByUserId'
import getUsersBySearch from '@/actions/getUsersBySearch'


interface userIdProps {
    searchParams : {
        id: string
    }
}


export const revalidate = 0

const ProfilePage = async (props: userIdProps) => {

    const { searchParams } = props

    const allUsers = await getUsersBySearch('');

    const userProfileInfo = await getUserProfileById( searchParams.id )

    const songs = await getSongsByUserId(searchParams.id)

  return (
    
    <ProfilePageContent userProfileInfo={ userProfileInfo } songs={songs} allUsers={allUsers} />
  )

}

export default ProfilePage