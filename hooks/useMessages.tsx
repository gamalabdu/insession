"use client";

import { ConversationsContext } from "@/providers/conversations";
import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";

export default function useMessages(conversation_id: string) {
  const { setConversations } = useContext(ConversationsContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!setConversations) return;
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
        async (payload) => {
          const message = { ...payload.new, seen: true } as Message;
          const { data: files } = await supabase
            .from("messages_files")
            .select("type")
            .eq("message_id", message.message_id)
            .returns<StorageFile[]>();
          if (payload.new.conversation_id === conversation_id) {
            setMessages((prev) => [...prev, message]);
          }
          setConversations((prev) => {
            const newArr = [...prev];
            const index = newArr.findIndex(
              (item) => item.conversation_id === message.conversation_id
            );
            if (index === -1) {
              return prev;
            }
            newArr[index].latest_message = { ...message, files: files || [] };
            return newArr;
          });
        }
      )
      .subscribe();
  }, [conversation_id, setConversations]);

  return {
    messages,
  };
}
