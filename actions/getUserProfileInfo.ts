import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Profile } from "@/types";

const getUserProfileInfo= async (): Promise<Profile> => {

  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData , error: sessionError } = await supabase.auth.getSession()

  if ( sessionError ) {
    console.log(sessionError.message)
  }

  const { data , error } = await supabase
  .from('profiles')
  .select('*')
  .eq( 'id' , sessionData.session?.user.id )
  .single()



  if ( error ) {
    console.log(error.message)
  }

  return data as Profile || []

};

export default getUserProfileInfo