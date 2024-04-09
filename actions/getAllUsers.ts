import { createClient } from "@/utils/supabase/server";

import { Profile } from "@/types";

const getAllUsers = async (): Promise<Profile[]> => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getAllUsers;
