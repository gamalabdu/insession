"use client"
import useLoadImage from '@/hooks/useLoadImage'
import { Profile, Song } from '@/types'
import Image from 'next/image'
import React from 'react'
import PlayButton from './PlayButton'
import qs  from 'query-string'
import { useRouter } from 'next/navigation'

interface ProfileItemProps {
    profile: Profile
    song : Song
    profileImageUrl: string
    onClick: ( id: string ) => void
}

const ProfileItem = (props : ProfileItemProps) => {

    const { song, onClick, profile, profileImageUrl } = props 

    const router = useRouter()


    const handleClick = ( id: string) => {

        onClick(id)

        const query = {
            id: profile.id
        }

        const url = qs.stringifyUrl({
            url: `/profile`,
            query: query
        }) 

        router.push(url)
        
    }

  return (
    <div
    onClick={ () => handleClick(song.id) }
    className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3' 
    >
        <div className='relative aspect-square w-full h-full rounded-md overflow-hidden'>
            <Image 
                className='object-cover' 
                fill 
                src={profile.avatar_url} 
                alt={'image'} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
        </div>

        <div className='flex flex-col items-start w-full pt-4 gap-y-1'>

            <p className='font-semibold truncate w-full'>
                {profile?.username}
            </p>

            <p className='text-neutral-400 text-sm w-full truncate'>
                By {profile?.email}
            </p>

            <p className='text-neutral-400 text-sm pb-4 w-full truncate'>
                HIP HOP / RNB
            </p>


        </div>

        <div className='absolute bottom-24 right-5'>
            <PlayButton/>
        </div>

    </div>
  )
}

export default ProfileItem