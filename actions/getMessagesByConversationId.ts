import { createClient } from "@/utils/supabase/server";

import { Message } from "@/types";

const getMessagesByConversationId = async (id: string): Promise<Message[]> => {
  const supabase = createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", id)
    .order("sent_at", { ascending: true });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getMessagesByConversationId;
