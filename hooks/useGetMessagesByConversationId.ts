import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

const useGetMessagesByConversationId = (conversation_id: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchUserInfo = async () => {
      setIsLoading(true);

      setError(null);

      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("sent_at", { ascending: true });

      setIsLoading(false);

      if (fetchError) {
        setError(fetchError.message);
        toast.error(fetchError.message);
        setMessages(null);
      } else {
        setMessages(data);
      }
    };

    fetchUserInfo();
  }, [conversation_id]);

  return { isLoading, messages, error };
};

export default useGetMessagesByConversationId;
