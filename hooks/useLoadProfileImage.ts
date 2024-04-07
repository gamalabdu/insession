import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";

const useLoadProfileImage = (profile: Profile) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Explicitly setting the state type
  const supabaseClient = createClient();
  useEffect(() => {
    // Correctly handling the synchronous call to getPublicUrl
    const response = supabaseClient.storage
      .from("profile-images")
      .getPublicUrl(profile?.avatar_url);
    console.log({ response });
    // Since getPublicUrl does not throw an error, we directly use the result
    setImageUrl(response.data.publicUrl);
  }, [profile, supabaseClient]);

  return imageUrl;
};

export default useLoadProfileImage;
