"use server";

import { createClient } from "@/utils/supabase/server";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// This function is now a server action and can be imported into your components.
export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    toast.error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
