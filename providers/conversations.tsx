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
    if (pathname !== "/messages") return;
    setAreLoading(true);
    const supabase = createClient();
    (async () => {
      const { data: results, error } = await supabase.rpc(
        "get_conversations_with_message"
      );
      setConversations(results);
      setAreLoading(false);
    })();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const message = payload.new as Message;
          setConversations((prev) => {
            const newArr = [...prev];
            const index = newArr.findIndex(
              (item) => item.conversation_id === message.conversation_id
            );
            if (index === -1) {
              return prev;
            }
            newArr[index].latest_message = message;
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
