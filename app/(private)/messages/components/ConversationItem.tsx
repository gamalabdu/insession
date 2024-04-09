"use client"
import React from 'react'
import Image from 'next/image'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useGetMessagesByConversationId from '@/hooks/useGetMessagesByConversationId'
import { useRouter } from 'next/navigation'
import { Conversation } from '@/types'

interface ConversationItemProps {
    conversation: Conversation
}

const ConversationItem = (props: ConversationItemProps) => {

    const router = useRouter()

    const { conversation } = props 

    const userProfile1 = useGetUserProfileInfo(conversation.participant_ids[0])
    const userProfile2 = useGetUserProfileInfo(conversation.participant_ids[1])

    const { messages } = useGetMessagesByConversationId(conversation.conversation_id)

    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null


    
    const handleClick = (conversation_id: string) => {

        router.push(`/messages/${conversation_id}`); 

    };




    return (
        <div
            onClick={() => handleClick(conversation.conversation_id)}
            className='flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full h-[70px] p-2 rounded-md'
        >
            <div className='relative rounded-md h-[48px] w-[48px]'>
                {/* Main user photo */}
                <Image 
                     src={userProfile1.userProfileInfo?.avatar_url || '/../public/images/liked.jpg'} 
                    alt='User profile'
                    layout='fill'
                    objectFit='cover'
                    className='rounded-md' 
                /> 
                {/* Second user photo */}
                <div className='absolute bottom-0 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[36px] w-[36px]'>
                    <Image 
                         src={userProfile2.userProfileInfo?.avatar_url || '/../public/images/liked.jpg'} 
                        alt='User profile'
                        layout='fill'
                        objectFit='cover'
                    />  
                </div>
            </div>

            <div className='flex flex-col gap-y-1 overflow-hidden w-full'>
                <p className='text-white truncate'>
                    You & {conversation.participants_names[1]}
                </p>
                <p className='text-neutral-400 text-sm truncate pl-4 overflow-hidden w-full'>
                    {lastMessage?.content}
                </p>
            </div>
        </div>
    )
}

export default ConversationItem;
