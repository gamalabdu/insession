"use client"
import { ConversationReturnItem, Message } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { ChatBubble } from '../../components/ChatBubble'
import { FiFilePlus } from 'react-icons/fi'
import { GrSend } from 'react-icons/gr'
import Input from '@/components/Input'
import toast from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import {Spinner} from "@nextui-org/react";


interface MessagesPageProps {
    messages: Message[]
    conversation_id : string
    currentConversation: ConversationReturnItem
}


const MessageBoard = (props : MessagesPageProps) => {

    const { messages, conversation_id, currentConversation } = props 

    const supabase = createClient()

    const router = useRouter()

    const { user, userDetails } = useUser()

    const [messageContent, setMessageContent] = useState<string>("");
  
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const secondUser = currentConversation.conversation_participants[0].profiles.id === userDetails?.id ?
    currentConversation.conversation_participants[0].profiles : 
    currentConversation.conversation_participants[1].profiles

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {

      setIsLoading(true);
  
      try {
        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversation_id,
            sender_id: user?.id,
            message_type: "text",
            content: messageContent,
            seen: true,
          });
  
        if (messageError) {
          setIsLoading(false);
          toast.error(messageError.message);
        }
      } catch {
        console.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
  
      setMessageContent("")
      router.refresh();
    };



  return (

    <div className='flex flex-col h-full'>

    <div className="flex flex-col flex-grow h-0 gap-4 p-4 overflow-auto rounded-md">
          {messages?.map((message, idx) => {
            return (
              <ChatBubble
                secondUser={secondUser}
                message={message}
                key={message.message_id}
              />
            );
          })}
          <div ref={messagesEndRef} />
  </div>

  <div className="w-full bottom-10 h-[50px] flex flex-row align-middle p-2 gap-2">
    <label
      htmlFor="file-input"
      className="cursor-pointer flex flex-col align-middle justify-center"
    >
      <FiFilePlus
        size={22}
        className="text-neutral-500 mt-1 hover:text-neutral-200"
      />
    </label>

    <input
      id="file-input"
      type="file"
      value={messageContent}
      accept="image/*, audio/*, zip"
      className="hidden"
    />

    <Input
      type="text"
      value={messageContent}
      placeholder="type your message here..."
      onChange={(e) => setMessageContent(e.target.value)}
    />

    <div className="cursor-pointer flex flex-col align-middle justify-center">
      {
        isLoading? 

        <Spinner size="sm" color="default" />

        :

        <GrSend
        onClick={() => sendMessage()}
        size={20}
        className="text-neutral-500 mt-1 hover:text-neutral-200"
      />

      }

    </div>
  </div>


  </div>

  )

}

export default MessageBoard