"use client"
import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import useProfileSetupModal from '@/hooks/useProfileSetupModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'
import Input from './Input'
import Button from './Button'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'

const ProfileSetupModal = () => {

    const supabaseClient = useSupabaseClient()

    const [ isLoading, setIsLoading ] = useState(false)

    const router = useRouter()

    const { session } = useSessionContext()

    const { user } = useUser()

    const userProfile = useGetUserProfileInfo(user?.id).userProfileInfo

    const profileSetupModal = useProfileSetupModal()

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            username: '',
            fullName: '',
            email: '',
            avatar_url: '',
        }
    })


    const onChange = (open : boolean) => {

        if ( !open ) {
            reset()
            profileSetupModal.onClose()
        }

    }


    useEffect(() => {

        if ( user ) {
            router.refresh() 
            profileSetupModal.onClose()
        } 

        
    }, [session , router, profileSetupModal.onClose ])




    const onSubmit : SubmitHandler<FieldValues> = async (values) => {


        try {

            setIsLoading(true)

            const profileImage = values.avatar_url?.[0]

            if ( !profileImage || !user ) {

                    toast.error("Missing fields")
                    return
            }

            const uniqueID = uniqid()

            // extracting the response from the client
            const { data: profileImageData , error: profileImageError  } = await supabaseClient
            .storage
            .from('profile-images')
            .upload(`image-${values.username}-${uniqueID}`, profileImage, {
                cacheControl: '3600',
                upsert: false
            })

            if ( profileImageError ) {
                setIsLoading(false)
                return toast.error(profileImageError.message)
            }


            const { data : imageDataUrl } = supabaseClient.storage.from('profile-images').getPublicUrl(`image-${values.username}-${uniqueID}`)


            const { error: supabaseError } = await supabaseClient
            .from('profiles')
            .insert({ 
                id: user.id,
                username: values.username,
                email: values.email,
                avatar_url: imageDataUrl.publicUrl,
            })

            if ( supabaseError ) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }


            router.refresh()
            setIsLoading(false)
            toast.success("Profile updated!")
            reset()
            profileSetupModal.onClose()


        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }


    } 






  return (


    <Modal
    title="Welcome"
    description='Lets get your profile setup'
    isOpen={profileSetupModal.isOpen}
    onChange={ onChange }
>
    <form
     className='flex flex-col gap-y-4'
     onSubmit={ handleSubmit(onSubmit) }
    >
        <Input id="username" disabled={isLoading} { ...register( 'username', { required: true } ) } placeholder="user name" />

        <Input id="email" disabled={isLoading} { ...register( 'email', { required: true } ) } placeholder="Email" />

        <div>

            <div className='pb-1'>
                Select a profile image
            </div>

            <Input id="avatar_url" type='file' disabled={isLoading} { ...register( 'avatar_url', { required: true } ) } accept='image/*' />

        </div>

        <div className='text-sm text-center text-neutral-400'> Don't worry you'll be able to add more once your profile is setup! </div>

        <Button disabled={isLoading} type='submit'>
            Create
        </Button>

    </form>
</Modal>
  )
}

export default ProfileSetupModal