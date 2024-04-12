"use client"
import React from 'react'
import Image from 'next/image'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useGetMessagesByConversationId from '@/hooks/useGetMessagesByConversationId'
import { useRouter } from 'next/navigation'
import {ConversationReturnItem } from '@/types'
import drakePic from '../../../../public/images/liked.jpg'


interface ConversationItemProps {
    conversation: ConversationReturnItem
}

const ConversationItem = (props: ConversationItemProps) => {

    const router = useRouter()

    const { conversation } = props 

    console.log(conversation.profiles)

    // const { messages } = useGetMessagesByConversationId(conversation.conversation_id)

    // const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null


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
                    //  src={conversation.profiles[0].avatar_url || '/../public/images/liked.jpg'} 
                     src={drakePic} 
                    alt='User profile'
                    objectFit='cover'
                    className='rounded-md' 
                    width={50}
                    height={50}
                /> 
                {/* Second user photo */}
                <div className='absolute bottom-0 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[36px] w-[36px]'>
                    <Image 
                        //  src={conversation.profiles[1].avatar_url || '/../public/images/liked.jpg'} 
                         src={drakePic} 
                        alt='User profile'
                        objectFit='cover'
                        width={40}
                        height={40}
                    />  
                </div>
            </div>

            <div className='flex flex-col gap-y-1 overflow-hidden w-full'>
                <p className='text-white truncate'>
                    You & {conversation.profiles[1].username}
                </p>
                {/* <p className='text-neutral-400 text-sm truncate pl-4 overflow-hidden w-full'>
                    {lastMessage?.content}
                </p> */}
            </div>
        </div>
    )
}

export default ConversationItem;
