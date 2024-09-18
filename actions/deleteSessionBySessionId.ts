"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const deleteSessionBySessionId = async (jobId: string, userId: string) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('user_id', userId)
    .eq('job_id', jobId);

    redirect("/sessions"); // Redirect to "/session" on success


};

export default deleteSessionBySessionId;
