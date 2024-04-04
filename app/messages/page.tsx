
// "use client"
import Header from '@/components/Header'
import SearchInput from '@/components/SearchInput'
import useGetConversationsByUserId from '@/hooks/useGetConversationsByUserId'
import React from 'react'
import MessagesContent from './components/MessagesContent'
import getAllUserConversations from '@/actions/getAllUserConversations'
import { useUser } from '@/hooks/useUser'
import getUserProfileInfo from '@/actions/getUserProfileInfo'



export const revalidate = 0


const Messages = async () => {

    // const { conversations } = useGetConversationsByUserId()

    const conversations = await getAllUserConversations()

    const userProfileInfo = await getUserProfileInfo()

    const userConversations = conversations.filter((conversation) => conversation.participant_ids.includes(userProfileInfo?.id));


  return (
    <div
        className="
        bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
        "
        >
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold"> Messages </h1>
                    <SearchInput baseRoute='/messages' placeholder="Look up your messages..." />
                </div>
            </Header>


            <MessagesContent conversations={userConversations} />

        </div>
  )
  
}

export default Messages