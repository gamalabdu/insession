"use client";

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
  conversations: ConversationWithMessage[];
  setConversations: Dispatch<SetStateAction<ConversationWithMessage[]>>;
};

export const ConversationsContext = createContext<ConversationsContextType>({
  conversations: [],
  areLoading: true,
  setConversations: null!,
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
    const supabase = createClient();
    setAreLoading(true);
    (async () => {
      const { data: results, error } = await supabase.rpc(
        "get_conversations_with_message"
      );
      setConversations(results);
      setAreLoading(false);
    })();
  }, [pathname]);

  return (
    <ConversationsContext.Provider
      value={{ conversations, areLoading, setConversations }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
