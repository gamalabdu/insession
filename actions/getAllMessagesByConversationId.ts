import { createClient } from "@/utils/supabase/server";


const getAllUsers = async (conversation_id: string): Promise<Message[]> => {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("sent_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
};

export default getAllUsers;
