"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function deleteConversation(
  formData: FormData
): Promise<SupabaseResponse<string>> {
  const conversation_id = formData.get("conversation_id")?.toString();
  if (!conversation_id) {
    return {
      results: [],
      error: "No conversation ID found!",
    };
  }
  const supabase = createClient();
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("conversation_id", conversation_id);

  if (error) {
    return {
      error: error.message,
      results: [],
    };
  }

  revalidatePath("/messages");

  return {
    results: [conversation_id],
  };
}
