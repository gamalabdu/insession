import { createClient } from "@/utils/supabase/server";

import { Conversation, Profile } from "@/types";

const getConversationsByConversationId = async (
  id: string
): Promise<Conversation[]> => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("conversation_id", id)
    .order("created_at", { ascending: false })
    .single();

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getConversationsByConversationId;
