import { createClient } from "@/utils/supabase/server";

import { Conversation, ConversationReturnItem, Profile } from "@/types";
import toast from "react-hot-toast";



const getAllConversations = async (): Promise < ConversationReturnItem [] > => {
  
  const supabase = createClient();


  // const { data, error: convoError } = await supabase
  // .from('conversation_participants')
  // .select(`
  //     conversation_id,
  //     profile:user_id (id, username, avatar_url)
  // `)
  // .order("created_at", { ascending: false })
  
  // return data as any 

  const { data, error } = await supabase
  .from('conversations')
  .select(`
    conversation_id,
    conversation_participants (
      profiles (
        id,
        username,
        avatar_url
      )
    )
  `);


if (error) {
  console.error('Error fetching data', error);
}


  return data as any

};

export default getAllConversations;























