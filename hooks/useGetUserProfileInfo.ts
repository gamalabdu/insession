import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

const useGetUserProfileInfo = (id?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfileInfo, setUserProfileInfo] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // If id is undefined or null, immediately return without setting loading or making an API call
      setUserProfileInfo(null);
      return;
    }
    const supabase = createClient();

    const fetchUserInfo = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

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
  }, [id]);

  return { isLoading, userProfileInfo, error };
};

export default useGetUserProfileInfo;
