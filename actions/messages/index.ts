"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllConversations(): Promise<
  SupabaseResponse<Conversation>
> {
  const supabase = createClient();

  const { data: results, error } = await supabase
    .from("conversations")
    .select("*, users:profiles(*)")
    .returns<Conversation[]>();

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results,
  };
}

export async function getConversation(
  conversation_id: string
): Promise<SupabaseResponse<Conversation>> {
  const supabase = createClient();

  const { data: conversation, error } = await supabase
    .from("conversations")
    .select("*, users:profiles(*)")
    .eq("conversation_id", conversation_id)
    .returns<Conversation[]>()
    .single();

  if (error) {
    return {
      results: [],
      error: error.message,
    };
  }

  return {
    results: [conversation],
  };
}
