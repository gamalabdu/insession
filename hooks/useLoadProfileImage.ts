import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Profile } from "@/types";

const useLoadProfileImage = (profile: Profile | null) => {

    const [imageUrl, setImageUrl] = useState<string | null>(null); // Explicitly setting the state type
    
    const supabaseClient = useSupabaseClient();

    useEffect(() => {
        if (!profile || !profile.profile_image_url) {
            setImageUrl(null);
            return;
        }

        // Correctly handling the synchronous call to getPublicUrl
        const response = supabaseClient
            .storage
            .from("profile-images")
            .getPublicUrl(profile.profile_image_url);

        // Since getPublicUrl does not throw an error, we directly use the result
        setImageUrl(response.data.publicUrl);
    }, [profile, supabaseClient]);

    return imageUrl;
}

export default useLoadProfileImage;
