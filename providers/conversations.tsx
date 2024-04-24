"use client";

import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

type ConversationsContextType = {
  areLoading: boolean;
  unseenMessages: number;
  conversations: ConversationWithMessage[];
  setConversations: Dispatch<SetStateAction<ConversationWithMessage[]>>;
  setUnseenMessages: Dispatch<SetStateAction<number>>;
};

export const ConversationsContext = createContext<ConversationsContextType>({
  conversations: [],
  unseenMessages: 0,
  areLoading: true,
  setConversations: null!,
  setUnseenMessages: null!,
});

export default function ConversationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();
  const [unseenMessages, setUnseenMessages] = useState(0);
  const [areLoading, setAreLoading] = useState(true);
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationWithMessage[]>(
    []
  );

  useEffect(() => {
    const supabase = createClient();
    setAreLoading(true);
    (async () => {
      const { data: results } = await supabase.rpc(
        "get_conversations_with_message"
      );
      setConversations(results);
      setAreLoading(false);
    })();
    if (pathname.startsWith("/messages") && pathname !== "/messages") return;
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          setUnseenMessages((prev) => prev + 1);
          const message = payload.new as Message;
          const { data: files } = await supabase
            .from("messages_files")
            .select("type")
            .eq("message_id", message.message_id)
            .returns<StorageFile[]>();
          setConversations((prev) => {
            const index = prev.findIndex(
              (item) => item.conversation_id === message.conversation_id
            );
            if (index === -1) {
              return prev;
            }
            const newArr = [...prev];
            const conversation = Object.assign({}, newArr[index]);
            conversation.latest_message = { ...message, files: files || [] };
            newArr[index] = conversation;
            return newArr;
          });
        }
      )
      .subscribe();
  }, [pathname]);
  // comment
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    (async () => {
      const { count } = await supabase
        .from("messages")
        .select("message_id", { count: "exact" })
        .eq("seen", false)
        .neq("sender_id", user?.id);
      console.log({ count });
      setUnseenMessages(count || 0);
    })();
  }, [user]);

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        unseenMessages,
        setUnseenMessages,
        areLoading,
        setConversations,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
