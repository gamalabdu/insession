import { createClient } from "@/utils/supabase/server";
import { Job } from "@/types";


const getAllJobs = async (): Promise<Job[]> => {

  const supabase = createClient();

  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("jobs")
    .select("* , genres(name)")
    .not("user_id", "eq", user?.id)
    .order("created_at", { ascending: false });

  
  console.log(data)

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getAllJobs;
