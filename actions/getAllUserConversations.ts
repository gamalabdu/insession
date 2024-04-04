import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Conversation, Profile } from "@/types";

const getAllConversations = async (): Promise<Conversation[]> => {

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
  .contains('participant_ids', JSON.stringify([sessionData.session?.user.id]))
  .order('created_at', { ascending: false })


  if ( error ) {
    console.log(error.message)
    return []; // Return an empty array if there's an error
  }

  // Check if data is null or empty
  if (!data || data.length === 0) {
    return []; // Return an empty array if there's no data returned
  }

  return data as any;

};

export default getAllConversations






