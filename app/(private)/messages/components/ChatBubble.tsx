import { useUser } from '@/hooks/useUser';
import { Message } from '@/types';
import Image from 'next/image';
import React from 'react'

interface ChatBubbleProps {
    message: Message;
    mainUserPhoto: string,
    secondUserPhoto: string,
    mainUserName: string,
    secondUserName: string
  }
  
  export const ChatBubble = (props: ChatBubbleProps) => {

    const { message, secondUserName, mainUserName, mainUserPhoto, secondUserPhoto } = props
    
    const { user } = useUser()

    const isCurrentUser = user?.id === message.sender_id;

  
    return (
      <div className={`flex ${!isCurrentUser ? "justify-start" : "justify-end"}`}>


        <div className="mb-1 flex justify-center align-middle mr-2">

        <div className='relative rounded-md h-[48px] w-[48px]'>
            <Image 
               src={!isCurrentUser ? secondUserPhoto && secondUserPhoto : mainUserPhoto && mainUserPhoto}
               alt='userPhoto'
                objectFit='cover'
                layout='contain'
                className='rounded-md' 
                width={48} // Specify width
                height={48} // Specify height
            />
            </div>

          <div className='flex flex-col'>
            <time className="text-xs opacity-50 ml-1">
                {new Date(message.sent_at).toTimeString().slice(0, 5)}
            </time>
            <div className='ml-1 opacity-50'>
            {!isCurrentUser ? mainUserName && mainUserName : secondUserName && secondUserName}
            </div>
          </div>
          
        </div>

          <div
            className={`${isCurrentUser ? " bg-neutral-700 rounded-md p-2 w-1/2 " : "flex bg-neutral-500 rounded-md p-2 w-1/2"}`}
          >
            {message.content}
          </div>


      </div>
    );
  };