import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Conversation, Profile } from "@/types";
import { useUser } from "./useUser";

const useGetConversationsByUserId = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [conversations, setConversations] = useState<Conversation[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { supabaseClient } = useSessionContext();

    const { user } = useUser()

    useEffect(() => {

        if (!user?.id) {
            setConversations(null);
            setError('No ID provided');
            return;
        }

        const fetchUserInfo = async () => {

            setIsLoading(true);

            setError(null);
            
            // const { data , error: fetchError } = await supabaseClient
            //     .from('conversations')
            //     .select('*')

            const { data, error: fetchError } = await supabaseClient
            .from('conversations')
            .select('*')
            .contains('participant_ids', JSON.stringify([user.id]))

            setIsLoading(false);

            if (fetchError) {
                setError(fetchError.message);
                toast.error(fetchError.message);
                setConversations(null);
            } else {
                setConversations(data); 
            }
        };

        fetchUserInfo();

    }, [supabaseClient]);

    return { isLoading, conversations , error };
};

export default useGetConversationsByUserId
