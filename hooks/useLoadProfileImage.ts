// import { useEffect, useState } from "react";
// import { Profile } from "@/types";
// import { createClient } from "@/utils/supabase/client";

// const useLoadProfileImage = (profile: Profile) => {
  
//   const [imageUrl, setImageUrl] = useState<string | null>(null); // Explicitly setting the state type
//   const supabaseClient = createClient();
//   useEffect(() => {
//     // Correctly handling the synchronous call to getPublicUrl
//     const response = supabaseClient.storage
//       .from("profile-images")
//       .getPublicUrl(profile?.avatar_url);

//     // Since getPublicUrl does not throw an error, we directly use the result
//     setImageUrl(response.data.publicUrl);
//   }, [profile, supabaseClient]);

//   return imageUrl;
// };

// export default useLoadProfileImage;




import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";

const useLoadProfileImage = (profile: Profile | null) => {

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!profile || !profile.avatar_url) {
      // Optionally set a default image URL if no profile is provided
      setImageUrl("../public/images/liked.jpg");
      return;
    }

    // Proceed with fetching the public URL if a valid profile is provided
    const response = supabase.storage.from("profile-images").getPublicUrl(profile.avatar_url);

    setImageUrl(response.data?.publicUrl);
    
  }, [profile, supabase]);

  return imageUrl;
};

export default useLoadProfileImage;
