"use client"
import { Profile } from '@/types'
import React from 'react'
import ExploreItem from './ExploreItem'
import { useUser } from '@/hooks/useUser'


interface ExploreContentProps {
    allUsers: Profile[]
}

const ExploreContent = (props: ExploreContentProps) => {

    const { allUsers } = props

    const { user } = useUser()

    const allUsersNotCurrentUser = allUsers.filter((thisUser) => thisUser.id != user?.id)


    if ( allUsers.length === 0) {
      return (
      <div className='flex flex-col gap-y-2 w-full h-full px-6 text-neutral-400'>
          No songs found.
      </div>
    )
  }

  return (
    <div className='
    grid 
    grid-cols-2 
    sm:grid-cols-3
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-5
    2xl:grid-cols-8
    gap-4
    mt-4
    '>


        {
          allUsersNotCurrentUser.map( ( user ) => ( 

          <ExploreItem key={user.id} currentUser={user} />
          
          ))
        }


      </div>
  )
}

export default ExploreContent