
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Profile } from "@/types";
import getAllUsers from "./getAllUsers";


const getUsersBySearch = async ( search: string ): Promise<Profile[]> => {

  const supabase = createServerComponentClient({
    cookies: cookies
  });


  if (!search) {

    const allUsers = await getAllUsers()

    return allUsers

  }


  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${search}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getUsersBySearch;