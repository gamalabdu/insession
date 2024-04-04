import { createClient } from "@/utils/supabase/server";

import { Profile } from "@/types";

const getUserProfileById = async (id: string): Promise<Profile> => {
  const supabase = createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    // return null
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .order("created_at", { ascending: false })
    .single();

  if (error) {
    console.log(error.message);
  }

  return data as Profile;
};

export default getUserProfileById;
