"use client";

import { ConversationsContext } from "@/providers/conversations";
import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";
import { useUser } from "./useUser";

export default function useMessages(conversation_id: string) {
  const { setConversations, setUnseenMessages } =
    useContext(ConversationsContext);
  const { user } = useUser();

  const [messages, setMessages] = useState<MessageWithFiles[]>([]);

  useEffect(() => {
    if (!setConversations) return;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, files:messages_files(id, url, type, file_name)")
        .eq("conversation_id", conversation_id)
        .order("sent_at", { ascending: true });
      if (data) {
        setMessages(data);
        setConversations((prev) => {
          const newArr = [...prev];
          const index = newArr.findIndex(
            (item) => item.conversation_id === conversation_id
          );
          if (index === -1) return prev;
          const conversation = Object.assign({}, newArr[index]);
          conversation.latest_message = {
            ...conversation.latest_message,
            seen: true,
          };
          newArr[index] = conversation;
          return newArr;
        });
      }
    })();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          // if (payload.new.conversation_id !== conversation_id) return;
          const message = {
            ...(payload.new as Message),
            seen: true,
            files: [],
          } as MessageWithFiles;
          // update current conversation
          setMessages((prev) => [...prev, message]);
          // update all conversations
          setConversations((prev) => {
            const newArr = [...prev];
            const index = newArr.findIndex(
              (item) => item.conversation_id === message.conversation_id
            );
            if (index === -1) {
              return prev;
            }
            const conversation = Object.assign({}, newArr[index]);
            conversation.latest_message = { ...message, files: [] };
            newArr[index] = conversation;
            return newArr;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages_files" },
        async (payload) => {
          const file = payload.new as StorageFile;
          // update current conversation
          setMessages((prev) => {
            const index = prev.findIndex(
              (message) => message.message_id === file.message_id
            );
            if (index === -1) return prev;
            const newMessages = [...prev];
            const newMessage = Object.assign({}, newMessages[index]);
            newMessage.files = [...newMessage.files, file];
            newMessages[index] = newMessage;
            return newMessages;
          });
          // update all conversations
          setConversations((prev) => {
            const index = prev.findIndex(
              (item) => item.conversation_id === conversation_id
            );
            if (index === -1) return prev;
            const newArr = [...prev];
            const conversation = Object.assign({}, newArr[index]);
            const latestMessage = Object.assign(
              {},
              conversation.latest_message
            );
            latestMessage.files = [...latestMessage.files, file];
            conversation.latest_message = latestMessage;
            newArr[index] = conversation;
            return newArr;
          });
        }
      )
      .subscribe();
  }, [conversation_id, setConversations]);

  useEffect(() => {
    if (!user || messages.length === 0) return;
    const supabase = createClient();
    (async () => {
      const { data: messageIds, count } = await supabase
        .from("messages")
        .select("message_id", { count: "exact", head: false })
        .eq("seen", false)
        .eq("conversation_id", conversation_id)
        .neq("sender_id", user.id);
      if (!count || count === 0) return;
      setUnseenMessages((prev) => prev - count);
      await supabase
        .from("messages")
        .update({ seen: true })
        .in(
          "message_id",
          messageIds.map((item) => item.message_id)
        );
    })();
  }, [user, messages, conversation_id]);

  return {
    messages,
  };
}
