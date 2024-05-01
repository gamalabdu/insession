import getSongBySongId from '@/actions/songs/getSongBySongId'
import Header from '@/components/ui/Header'
import React from 'react'
import SongPageContent from './components/SongPageContent'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import getUserProfileInfo from '@/actions/getUserProfileInfo'




interface SongPageProps {
    params?: {
        song_id: string
    }
}

const SongPage = async (props : SongPageProps) => {

    const { params } = props 

    if ( !params?.song_id) {
      redirect('/dashboard')
    }

    const song = await getSongBySongId(params.song_id)

    const userProfileInfo = await getUserProfileInfo()

  return (

    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">

      <Header>
        <div className="mt-10 flex">
          <div className="flex md:flex-row items-center gap-x-5">
            <div className="relative rounded-md h-[300px] w-[300px]">
              <Image
                src={song.image_path || "/images/userIcon.png"}
                alt="User profile"
                fill
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                by {song.owner.username}
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {song.title}
              </h1>
            </div>
          </div>
        </div>
      </Header>


       <SongPageContent song={song} userProfileInfo={userProfileInfo} />
        
    
    </div>

  )
}


export default SongPage