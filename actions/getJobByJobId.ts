import { createClient } from "@/utils/supabase/server";
import { Job } from "@/types";


const getJobByJobId = async (jobId : string): Promise<Job> => {

  const supabase = createClient();


  const { data, error } = await supabase
  .from('jobs')
  .select('*')
  .eq('job_id', jobId) // Make sure 'id' matches the column name in your table
  .single();

  if (error) {
    console.log(error.message);
  }

  return (data as Job) || [];
};

export default getJobByJobId;
