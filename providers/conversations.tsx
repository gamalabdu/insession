"use client";

import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import { ReactNode, createContext, useEffect, useState } from "react";

type ConversationsContextType = {
  areLoading: boolean;
  conversations: ConversationWithMessage[];
};

export const ConversationsContext = createContext<ConversationsContextType>({
  conversations: [],
  areLoading: true,
});

export default function ConversationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [areLoading, setAreLoading] = useState(true);
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationWithMessage[]>(
    []
  );

  useEffect(() => {
    if (!pathname.startsWith("/messages")) return setAreLoading(false);
    setAreLoading(true);
    const supabase = createClient();
    (async () => {
      const { data: results, error } = await supabase.rpc(
        "get_conversations_with_message"
      );
      console.log(results);
      setConversations(results);
      setAreLoading(false);
    })();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const message = payload.new as Message;
          const { data: files } = await supabase
            .from("messages_files")
            .select("type")
            .eq("message_id", message.message_id)
            .returns<StorageFile[]>();
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
  }, [pathname]);

  return (
    <ConversationsContext.Provider value={{ conversations, areLoading }}>
      {children}
    </ConversationsContext.Provider>
  );
}
