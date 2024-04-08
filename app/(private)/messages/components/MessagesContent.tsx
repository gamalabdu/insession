"use client"
import LikeButton from '@/components/LikeButton'
import MediaItem from '@/components/MediaItem'
import useOnPlay from '@/hooks/useOnPlay'
import { Conversation, Message, Song } from '@/types'
import React from 'react'
import ConversationItem from './ConversationItem'
import Link from 'next/link'

interface MessagesContentProps {
    conversations: Conversation[] | null
}

const MessagesContent = (props: MessagesContentProps) => {

    const { conversations } = props


    if ( conversations?.length === 0 ) {
        return (
        <div className='flex flex-col gap-y-2 w-full px-6 text-neutral-400'>
            No conversations found.
        </div>
      )
    }


  return (
    <div className='
      flex
      flex-col
      gap-y-2
      w-full
      px-6
    '>
        {
            conversations?.map((conversation) => {

                return (
                    <div 
                    key={conversation.conversation_id}
                    className='flex items-center gap-x-4 w-full'
                    >
                    <div className='flex-1 overflow-y-auto'>

                        <ConversationItem  conversation={conversation} />
  
                    </div> 

                    
                </div>
                )
            })

        }
    </div>
  )
}

export default MessagesContent