"use client"
import React, { useState } from 'react'
import Modal from './Modal'
import useUploadModal from '@/hooks/useUploadModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import toast from 'react-hot-toast'
import { useUser } from '@/hooks/useUser'
import { unique } from 'next/dist/build/utils'
import uniqid from 'uniqid'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

const UploadModal = () => {

    const uploadModal = useUploadModal()

    const supabase = createClient()

    const router = useRouter()

    const [ isLoading, setIsLoading ] = useState(false)

    const { user, userDetails } = useUser()


    const { register, handleSubmit, reset } = useForm<FieldValues>({

        defaultValues: {
            title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open : boolean) => {

        if ( !open ) {
            reset()
            uploadModal.onClose()
        }

    }


    const onSubmit : SubmitHandler<FieldValues> = async (values) => {

        try {

            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if ( !imageFile || !songFile || !user ) {

                    toast.error("Missing fields")
                    return
            }

            const uniqueID = uniqid()

            // extracting the response from the client
            const { data: songData , error: songError  } = await supabase
            .storage
            .from('songs')
            .upload(`song-${values.title}-${uniqueID}`, songFile, {
                cacheControl: '3600',
                upsert: false
            })

            if ( songError ) {
                setIsLoading(false)
                return toast.error(songError.message)
            }



             // extracting the response from the client
             const { data: imageData , error: imageError  } = await supabase
             .storage
             .from('images')
             .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                 cacheControl: '3600',
                 upsert: false
             })


             if ( imageError ) {
                setIsLoading(false)
                return toast.error("Failed image upload")
            }


            const { error: supabaseError } = await supabase
            .from('songs')
            .insert({ 
                user_id: user.id,
                title: values.title,
                username: userDetails?.username,
                image_path: imageData.path,
                song_path: songData.path
            })

            if ( supabaseError ) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }


            router.refresh()
            setIsLoading(false)
            toast.success("Song created!")
            reset()
            uploadModal.onClose()


        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }


    } 


  return (
    <Modal
        title="Add a song"
        description='Upload and mp3 or Wav file'
        isOpen={uploadModal.isOpen}
        onChange={ onChange }
    >
        <form
         className='flex flex-col gap-y-4'
         onSubmit={ handleSubmit(onSubmit) }
        >
            <Input id="title" disabled={isLoading} { ...register( 'title', { required: true } ) } placeholder="Song title" />

            <div>

                <div className='pb-1'>
                    Select a song file
                </div>

                <Input id="song" type='file' disabled={isLoading} { ...register( 'song', { required: true } ) } accept='.mp3 , .wav' />

            </div>


            <div>

                <div className='pb-1'>
                    Select a cover art
                </div>

                <Input id="image" type='file' disabled={isLoading} { ...register( 'image', { required: true } ) } accept='image/*' />

            </div>

            <Button disabled={isLoading} type='submit'>
                Create
            </Button>

        </form>
    </Modal>
  )
}

export default UploadModal