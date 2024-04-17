"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import useGetMessagesByConversationId from "@/hooks/useGetMessagesByConversationId";
import { IoIosMail } from "react-icons/io";
import { createClient } from "@/utils/supabase/client";


const ConversationItem = ({
  conversation_id,
  users,
  latest_message,
}: ConversationWithMessage) => {

  const router = useRouter();

  const { user } = useUser();

  const supabase = createClient()

  const [messages, setMessages] = useState<Message[]>([]);

  // const { messages } = useGetMessagesByConversationId(conversation_id);


  useEffect(() => {

    const supabase = createClient();

    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, messages_files(id, url, type, file_name)")
        .eq("conversation_id", conversation_id)
        .order("sent_at", { ascending: true });
      data && setMessages(data);
    })();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.conversation_id === conversation_id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();
  }, [conversation_id]);




  const otherUser = users.find((item) => item.id !== user?.id);

  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;


  const handleClick = async (conversation_id: string) => {

    try {
      // Step 1: Fetch messages that have not been seen
      const { data: messagesToBeUpdated, error: selectError } = await supabase
        .from('messages')
        .select('message_id')
        .eq('conversation_id', conversation_id)
        .eq('seen', false);
  
      if (selectError) {
        throw selectError;
      }
  
      // Check if there are any messages to update
      if (messagesToBeUpdated.length > 0) {
        // Step 2: Update these messages to mark as seen
        const { error: updateError } = await supabase
          .from('messages')
          .update({ seen: true })
          .in('message_id', messagesToBeUpdated.map(msg => msg.message_id));
  
        if (updateError) {
          throw updateError;
        }
      }
  

    } catch (error) {
      console.log(error || 'An unexpected error occurred');
    } finally {

       // Navigate to the conversation page
      router.push(`/messages/${conversation_id}`);

    }

  };

  if (!otherUser) {
    return (
      <div>
        <span>The other user has not been found</span>
      </div>
    );
  }

  const sender = users.find((item) => item.id === latest_message?.sender_id);


  return (
    <div
      onClick={() => handleClick(conversation_id)}
      className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >


            {/* overflow-hidden */}
      <div className="aspect-square h-[70px] relative rounded-full bg-gray-200">
      <div className="aspect-square h-[70px] relative overflow-hidden rounded-full bg-gray-200">
        <Image
          src={otherUser.avatar_url}
          alt="User profile"
          layout="fill"
          objectFit="cover"
          className="rounded-full" // Changed from rounded-md to rounded-full
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        { lastMessage?.sender_id != user?.id && lastMessage?.seen != true && <IoIosMail size={20} className="absolute right-0 bottom-0" color="red"/> }
        
      </div>
      <div className="flex-1 flex flex-col justify-center p-2 truncate">
        <span
          onClick={() => router.push(`/profile?id=${otherUser.id}`)}
          className="text-sm mt-1 text-neutral-500 hover:text-neutral-400 hover:underline"
        >
          <span>{otherUser.username}</span>

        </span>
        <p className="text-neutral-400 text-base truncate">

          {lastMessage?.sender_id === user?.id && ` You :  ${lastMessage?.content} ` }

          <time className="text-xs opacity-50 ml-1">
            sent at : {" "}
            {new Date(lastMessage?.sent_at as string).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </time>

        </p>
      </div>
      </div>
    </div>
  )
}

export default ConversationItem;
