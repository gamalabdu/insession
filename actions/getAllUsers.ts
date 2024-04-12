import { createClient } from "@/utils/supabase/server";

import { Profile } from "@/types";

const getAllUsers = async (): Promise<Profile[]> => {

  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getAllUsers;
