import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Conversation, Profile } from "@/types";

const getConversationsByConversationId = async (id: string): Promise<Conversation[]> => {

  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData , error: sessionError } = await supabase.auth.getSession()

  if ( sessionError ) {
    console.log(sessionError.message)
    return []
  }

  const { data , error } = await supabase
  .from('conversations')
  .select('*')
  .eq('conversation_id', id)
  .order('created_at', { ascending: false })
  .single()


  if ( error ) {
    console.log(error.message)
  }


  return data as any || []

};

export default getConversationsByConversationId






