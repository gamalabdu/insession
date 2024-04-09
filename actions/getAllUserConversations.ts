import { createClient } from "@/utils/supabase/server";

import { Conversation, Profile } from "@/types";

const getAllConversations = async (): Promise<Conversation[]> => {
  
  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .contains("participant_ids", JSON.stringify([user?.id]))
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
    return []; // Return an empty array if there's an error
  }

  // Check if data is null or empty
  if (!data || data.length === 0) {
    return []; // Return an empty array if there's no data returned
  }

  return data as any;
};

export default getAllConversations;
