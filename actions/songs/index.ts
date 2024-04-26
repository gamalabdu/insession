"use server";

import { Genre } from "@/types";
import { getAudioDuration } from "@/utils/songs";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import uniqid from "uniqid";

export async function uploadSong(formData: FormData) {
  const songFile = formData.get("song") as File;
  const imageFile = formData.get("image") as File;

  if (!imageFile || !songFile) {
    return {
      error: "Missing fields",
    };
  }

  const bpm = formData.get("bpm")?.toString();
  const key = formData.get("key")?.toString();
  const title = formData.get("title")?.toString();
  const duration = formData.get("duration")?.toString();

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const uniqueID = uniqid();

  // extracting the response from the client
  const { error: songError } = await supabase.storage
    .from("songs")
    .upload(`song-${title}-${uniqueID}`, songFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (songError) {
    return {
      error: songError.message,
    };
  }

  // extracting the response from the client
  const { error: imageError } = await supabase.storage
    .from("images")
    .upload(`image-${title}-${uniqueID}`, imageFile, {
      cacheControl: "3600",
      upsert: false,
    });

  if (imageError) {
    return {
      error: imageError.message,
    };
  }

  const { data: songUrl } = supabase.storage
    .from("songs")
    .getPublicUrl(`song-${title}-${uniqueID}`);

  const { data: imageUrl } = supabase.storage
    .from("images")
    .getPublicUrl(`image-${title}-${uniqueID}`);

  const { data: song, error: insertError } = await supabase
    .from("songs")
    .insert({
      user_id: user?.id,
      title,
      username: "", // we don't need this if the song is already connected to users
      image_path: imageUrl.publicUrl,
      song_path: songUrl.publicUrl,
      duration,
      bpm,
      key,
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      error: insertError.message,
    };
  }

  const genres = (
    JSON.parse(formData.get("genres")?.toString() || "[]") as Genre[]
  ).map((genre) => ({
    song_id: song?.id,
    genre_id: genre.id,
  }));

  const { error: songGenreError } = await supabase
    .from("song_genres")
    .insert(genres);

  if (songGenreError) {
    return {
      error: songGenreError.message,
    };
  }

  revalidatePath("/", "layout");

  return {
    error: null,
  };
}
