import { createClient } from "@/utils/supabase/server";

import { Profile } from "@/types";
import getAllUsers from "./getAllUsers";

const getUsersBySearch = async (search: string): Promise<Profile[]> => {
  const supabase = createClient();

  if (!search) {
    const allUsers = await getAllUsers();

    return allUsers;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.%${search}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getUsersBySearch;
