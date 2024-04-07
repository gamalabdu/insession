"use client"
import useAuthModal from '@/hooks/useAuthModal'
import useUploadModal from '@/hooks/useUploadModal'
import { useUser } from '@/hooks/useUser'
import { Song } from '@/types'
import React from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { TbPlaylist } from 'react-icons/tb'
import MediaItem from './MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useProfileSetupModal from '@/hooks/useProfileSetupModal'
import usePostSessionModal from '@/hooks/usePostSessionModal'

interface LibaryProps {
    songs: Song[]
}

const Library = ( props: LibaryProps) => {

    const { songs } = props 

    const authModal = useAuthModal()
    const uploadModal = useUploadModal()
    const profileSetupModal = useProfileSetupModal()
    const postSessionModal = usePostSessionModal()


    const { user } = useUser()

    const { userProfileInfo } = useGetUserProfileInfo(user?.id)

    const onPlay = useOnPlay(songs)

    const onClick = () => {

        
        if ( !user ) {
            return authModal.onOpen()
        }

        if( user && !userProfileInfo?.avatar_url ) {
            return profileSetupModal.onOpen()
        }

        return uploadModal.onOpen()

    }


    return (
        <div className='flex flex-col'>
            <div className='flex items-center justify-between px-5 pt-4'>
                <div className='inline-flex items-center gap-x-2'>
                    <TbPlaylist size={26} className='text-neutral-400' />
                    <p className='text-neutral-400 font-medium text-md'> Your Uploads </p>
                </div>
                <AiOutlinePlus
                    onClick={onClick}
                    size={20}
                    className='text-neutral-400 cursor-pointer hover:text-white transtion'
                />
            </div>
            <div className='flex flex-col gap-y-2 mt-4 px-3'>
                {
                    songs.length > 0 ? 

                    songs.map( (song) => (
                        <MediaItem
                            onClick={ (id: string) => onPlay(id) } 
                            key={song.id}
                            song={song}
                        />
                    ))

                    : 

                    <div> No songs uploaded. Click the plus icon to upload a song! </div>
                }
            </div>
        </div>
    )
}

export default Library