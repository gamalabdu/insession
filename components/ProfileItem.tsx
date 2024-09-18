"use client"
import useLoadImage from '@/hooks/useLoadImage'
import { Song } from '@/types'
import Image from 'next/image'
import React from 'react'
import PlayButton from './PlayButton'
import qs  from 'query-string'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import LikeUserButton from './LikeUserButton'

interface ProfileItemProps {
    profile: Profile
    song : Song
    onClick: ( id: string ) => void
}

const ProfileItem = (props : ProfileItemProps) => {

    const { song, onClick, profile } = props 

    const router = useRouter()

    const handleClick = () => {

        const query = {
            id: profile.id
        }

        const url = qs.stringifyUrl({
            url: `/profile`,
            query: query
        }) 

        router.push(url)

    }

    const handlePlayClick = ( e: React.MouseEvent<HTMLDivElement>, id: string ) => {

        e.stopPropagation()
        onClick(id)
        
    }

  return (
    <div
    className='relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3' 
    >
        <div className='relative aspect-square w-full h-full rounded-md overflow-hidden' onClick={ () => handleClick()  }>
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
                {profile.location}
            </p>

           { profile.genres != null && 
            <p className='text-neutral-400 text-sm pb-4 w-full truncate'>
                {profile.genres.map((genre) => genre).join(" / ")}
            </p>
            }


            <LikeUserButton artistId={profile.id} />


        </div>

       {
            song &&
            <div className='absolute bottom-24 right-5' onClick={(e) => handlePlayClick(e, song.id)} >
            <PlayButton/>
            </div>

       }


    </div>
  )
}

export default ProfileItem