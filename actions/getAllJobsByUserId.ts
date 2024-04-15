import { createClient } from "@/utils/supabase/server";
import { Job } from "@/types";


const getJobsByUserId = async (): Promise<Job[]> => {
  
  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getJobsByUserId;
