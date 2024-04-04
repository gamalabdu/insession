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
import useMessageModal from '@/hooks/useMessageModal'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import { Conversation } from '@/types'

const MessageModal = () => {

    const messageModal = useMessageModal()

    const supabaseClient = useSupabaseClient()

    const router = useRouter()

    const [ isLoading, setIsLoading ] = useState(false)

    const { user } = useUser()

    const userProfile = useGetUserProfileInfo(user?.id)

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            message : ''
        }
    })

    const onChange = (open : boolean) => {

        if ( !open ) {
            reset()
            messageModal.onClose()
        }

    }


    const onSubmit : SubmitHandler<FieldValues> = async (values) => {  

        try {

            setIsLoading(true)

            const { error: supabaseError } = await supabaseClient
            .from('conversations')
            .insert({ 
                participant_ids: [user?.id, messageModal.otherId] ,
                participants_names: [userProfile.userProfileInfo?.username, messageModal.otherUserName]
            })

            if ( supabaseError ) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }



        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }


        const { data: conversationData, error } = await supabaseClient
        .from('conversations')
        .select('conversation_id')
        .contains('participant_ids', JSON.stringify([userProfile.userProfileInfo?.id, messageModal.otherId ]))

        
        if ( conversationData && conversationData.length > 0) {
            // Access the first conversation's conversation_id
            const conversationId = conversationData[0].conversation_id;


            const { data: messageData , error: messageError } = await supabaseClient
            .from('messages')
            .insert(
            {
                        conversation_id: conversationId,
                        sender_id: user?.id,
                        message_type: 'text',
                        content: values.message,
                        seen: true,
            }
            )

            if (messageError) {
                    setIsLoading(false)
                    toast.error(messageError.message)
            }


        
            // Redirect to the messages page with the conversation ID
            router.push(`/messages/${conversationId}`);
        
            // Handle loading state and toast
            setIsLoading(false);
            toast.success("Message sent!");
            reset();
            messageModal.onClose();
        } else {
            toast.error("Conversation not found.");
        }

    } 


  return (
    <Modal
        title="Send a message"
        description='say hi or ask if they are intrested in working'
        isOpen={messageModal.isOpen}
        onChange={ onChange }
    >
        <form
         className='flex flex-col gap-y-4'
         onSubmit={ handleSubmit(onSubmit) }
        >
            <Input id="message" disabled={isLoading} { ...register( 'message', { required: true } ) } placeholder="Song title" />

            <Button disabled={isLoading} type='submit'>
                Send
            </Button>

        </form>
    </Modal>
  )
}

export default MessageModal