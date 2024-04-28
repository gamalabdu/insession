import { createClient } from "@/utils/supabase/server";


const getUserProfileById = async (id: string): Promise<Profile> => {

  const supabase = createClient();

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
