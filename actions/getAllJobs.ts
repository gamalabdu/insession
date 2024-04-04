import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Job } from "@/types";

const getAllJobs = async (): Promise<Job[]> => {

  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data: sessionData , error: sessionError } = await supabase.auth.getSession()

  if ( sessionError ) {
    console.log(sessionError.message)
    return []
  }

  const { data , error } = await supabase
  .from('jobs')
  .select('*')
  .not('user_id', 'eq', sessionData.session?.user.id)
  .order('created_at', { ascending: false } )

  if ( error ) {
    console.log(error.message)
  }

  return data as any || []

};

export default getAllJobs