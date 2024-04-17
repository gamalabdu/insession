
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const useLoadProfileImage = (profile: Profile | null) => {

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!profile || !profile.avatar_url) {
      // Optionally set a default image URL if no profile is provided
      setImageUrl("/images/userIcon.png");
      return;
    }

    // Proceed with fetching the public URL if a valid profile is provided
    const response = supabase.storage.from("profile-images").getPublicUrl(profile.avatar_url);

    setImageUrl(response.data?.publicUrl);
    
  }, [profile, supabase]);

  return imageUrl;
};

export default useLoadProfileImage;
