"use client"
import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import { useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import uniqid from 'uniqid'
import Input from './Input'
import Button from './Button'
import useEditProfileModal from '@/hooks/useEditProfileModal'
import getUserProfileInfo from '@/actions/getUserProfileInfo'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useLoadProfileImage from '@/hooks/useLoadProfileImage'
import { profile } from 'console'

const EditProfileModal = () => {

    const supabaseClient = useSupabaseClient()

    const [ isLoading, setIsLoading ] = useState(false)

    const router = useRouter()

    const { session } = useSessionContext()

    const { user } = useUser()

    const editProfileModal = useEditProfileModal()

    const userProfileInfo = useGetUserProfileInfo(user?.id).userProfileInfo

    const currentProfileImage = useLoadProfileImage(userProfileInfo)

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [fileSelected, setFileSelected] = useState(false);

    useEffect(() => {
        // This effect will update the image preview whenever currentProfileImage changes
        if (currentProfileImage) {
            setImagePreviewUrl(currentProfileImage);
        }
    }, [currentProfileImage]);


    const { register, handleSubmit, reset , watch, setValue } = useForm<FieldValues>({
        defaultValues: {
                username: userProfileInfo?.username,
                email: userProfileInfo?.email,
                avatar_url: userProfileInfo?.avatar_url,
        }
    })




    useEffect(() => {
        // Update form default values when userProfileInfo is available
        if (userProfileInfo) {
            reset(userProfileInfo);
            // Update image preview
            setImagePreviewUrl(currentProfileImage || '');
        }
    }, [userProfileInfo, reset]);




    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileSelected(true);
            const fileReader = new FileReader();
            fileReader.onload = function(e: ProgressEvent<FileReader>) {
                setImagePreviewUrl(e.target?.result as string);
            };
            fileReader.readAsDataURL(event.target.files[0]);
        }
    };




    const onChange = (open : boolean) => {

        if ( !open ) {
            reset()
            editProfileModal.onClose()
        }

    }


    useEffect(() => {

        if ( session ) {

            router.refresh() 
            editProfileModal.onClose()
        }
        
    }, [session, router, editProfileModal.onClose ])



    const onSubmit: SubmitHandler<FieldValues> = async (values) => {

        setIsLoading(true);

        try {

                const profileImage = values.avatar_url?.[0]

                const uniqueID = uniqid();

                const { data: profileImageData, error: profileImageError } = await supabaseClient
                    .storage
                    .from('profile-images')
                    .upload(`image-${values.username}-${uniqueID}`, profileImage, {
                        cacheControl: '3600',
                        upsert: false,
                    })


                if (profileImageError) {
                    throw profileImageError;
                }

            const { data : imageDataUrl } = supabaseClient.storage.from('profile-images').getPublicUrl(`image-${values.username}-${uniqueID}`)

            const { error: supabaseError } = await supabaseClient
                .from('profiles')
                .update({ 
                    id: user?.id,
                    username: values.username,
                    email: values.email,
                    avatar_url: imageDataUrl.publicUrl,
                })
                .eq('id', user?.id);

            if (supabaseError) {
                throw supabaseError;
            }

            toast.success("Profile updated!");
            reset(values); // Reset form with new values to set a new baseline for "changes detection"
            router.refresh()
            setIsLoading(false)
            reset()
            editProfileModal.onClose()



        } catch (error) {
            toast.error(`Update failed: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };




  return (


    <Modal
    title=""
    description=''
    isOpen={editProfileModal.isOpen}
    onChange={ onChange }
>
    <form
     className='flex flex-col gap-y-4'
     onSubmit={ handleSubmit(onSubmit) }
    >
        <Input id="username" disabled={isLoading} { ...register( 'username', { required: true } ) } placeholder="Display name" />

        <Input id="email" disabled={isLoading} { ...register( 'email', { required: true } ) } placeholder="Email" />

                <div className='flex flex-col justify-center'>
                
                    {imagePreviewUrl && <img src={imagePreviewUrl} alt="Profile Preview" className="w-20 h-20 object-cover" />}
                   
                    <div className='pb-1'>Select a profile image</div>
                    <Input
                        id="avatar_url"
                        type='file'
                        disabled={isLoading}
                        {...register('avatar_url', { required: true })}
                        accept='image/*'
                        onChange={handleFileChange}
                    />
                </div>

        {/* <div className='text-sm text-center text-neutral-400'> Don't worry you'll be able to add more once your profile is setup! </div> */}

        <Button disabled={isLoading} type='submit'>
            Update Profile
        </Button>

    </form>

</Modal>
  )
}

export default EditProfileModal