"use server";
import { createClient } from "@/utils/supabase/server";
import { Profile } from "@/types";

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
    .select("*")
    .eq("id", user?.id)
    .single();

  if (error) {
    console.log(error.message);
  }

  return (data as Profile) || [];
};

export default getUserProfileInfo;
