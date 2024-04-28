"use server";
import { createClient } from "@/utils/supabase/server";

const getUserProfileInfo = async (): Promise<Profile> => {

  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();


  if (sessionError) {
    console.log(sessionError.message);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("* , genres(name)")
    .eq("id", user?.id)
    .single();

  if (error) {
    console.log(error.message);
  }

  return (data as Profile) || [];
};

export default getUserProfileInfo;
