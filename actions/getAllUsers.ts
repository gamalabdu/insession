import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Profile } from "@/types";

const getAllUsers = async (): Promise<Profile[]> => {

  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData , error: sessionError } = await supabase.auth.getSession()

  if ( sessionError ) {
    console.log(sessionError.message)
    return []
  }

  const { data , error } = await supabase
  .from('profiles')
  .select('*')
  .order('created_at', { ascending: false } )


  if ( error ) {
    console.log(error.message)
  }


  return data as any || []

};

export default getAllUsers