
import React from 'react'
import ProfilePageContent from './components/ProfilePage'
import getUserProfileById from '@/actions/getUserProfileById'


interface userIdProps {
    searchParams : {
        id: string
    }
}


export const revalidate = 0

const ProfilePage = async (props: userIdProps) => {

    const { searchParams } = props

    const userProfileInfo = await getUserProfileById( searchParams.id )

  return (
    
    <ProfilePageContent userProfileInfo={ userProfileInfo } />
  )

}

export default ProfilePage