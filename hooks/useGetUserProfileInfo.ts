import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Profile } from "@/types";

const useGetUserProfileInfo = (id: string | undefined) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userProfileInfo, setUserProfileInfo] = useState<Profile | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        if (!id) {
            setUserProfileInfo(null);
            setError('No ID provided');
            return;
        }

        const fetchUserInfo = async () => {
            setIsLoading(true);
            setError(null);
            const { data, error: fetchError } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single()

            setIsLoading(false);

            if (fetchError) {
                setError(fetchError.message);
                toast.error(fetchError.message);
                setUserProfileInfo(null);
            } else {
                setUserProfileInfo(data);
            }
        };

        fetchUserInfo();
    }, [id, supabaseClient]);

    return { isLoading, userProfileInfo, error };
};

export default useGetUserProfileInfo;
