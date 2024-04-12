"use client"
import LikeButton from '@/components/LikeButton'
import LikeUserButton from '@/components/LikeUserButton'
import MediaItem from '@/components/MediaItem'
import ProfileItem from '@/components/ProfileItem'
import useOnPlay from '@/hooks/useOnPlay'
import { Profile } from '@/types'
import React from 'react'
import ExploreItem from '../../explore/components/ExploreItem'

interface LikedContentProps {
    artist: Profile[]
}

const LikedArtistContent = (props: LikedContentProps) => {

    const { artist } = props 

    


    if ( artist.length === 0 ) {
        return (
            <div className='
                flex
                flex-col
                gap-y-2
                w-full
                px-6
                text-neutral-400
            '>
                No liked Artist.
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
          artist.map( ( artist ) => ( 

          <ExploreItem key={artist.id} currentUser={artist} />
          
          ))
        }


      </div>
  )
}

export default LikedArtistContent