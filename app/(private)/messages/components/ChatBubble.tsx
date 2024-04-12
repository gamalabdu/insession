"use client"
import { useUser } from '@/hooks/useUser';
import { Message } from '@/types';
import Image from 'next/image';
import React from 'react'

interface ChatBubbleProps {
    message: Message;
    secondUser: {
      avatar_url: string;
      username: string;
      id: string;
    }
    
  }
  
  export const ChatBubble = (props: ChatBubbleProps) => {

    const { message, secondUser } = props
    
    const { userDetails } = useUser()
  
    return (
      <div className={`flex ${ message.sender_id === userDetails?.id ? "justify-start" : "justify-end"}`}>

        <div className="mb-1 flex justify-center align-middle mr-2">

        <div className='relative rounded-md h-[48px] w-[48px]'>
            <Image 
               src={secondUser.avatar_url}
               alt='userPhoto'
                objectFit='cover'
                fill
                className='rounded-md' 
            />
            </div>

          <div className='flex flex-col'>
          <time className="text-xs opacity-50 ml-1">
            {new Date(message.sent_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </time>
            <div className='ml-1 opacity-50'>
            {message.sender_id === userDetails?.id ? userDetails.username : secondUser.username}
            </div>
          </div>
          
        </div>

          <div
            className={`${message.sender_id === userDetails?.id ? " bg-neutral-700 rounded-md p-2 w-1/2 " : "flex bg-neutral-500 rounded-md p-2 w-1/2"}`}
          >
            {message.content}
          </div>


      </div>
    );
  };