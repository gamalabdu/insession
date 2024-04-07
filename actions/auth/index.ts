"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const username = formData.get("username")?.toString();
  const email = formData.get("email")!.toString();
  const password = formData.get("password")!.toString();

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  //   insert to profiles with new id and username
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: data.user?.id, username, email });

  revalidatePath("/", "layout");
  redirect("/");
}
