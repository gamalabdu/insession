
import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Conversation } from "@/types";
import { useUser } from "./useUser";

const useGetConversationByConversationId = (id: string) => {

    const [isLoading, setIsLoading] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { supabaseClient } = useSessionContext();

    const { user } = useUser()

    useEffect(() => {

        if (!user?.id) {
            setConversation(null);
            setError('No ID provided');
            return;
        }

        const fetchUserInfo = async () => {

            setIsLoading(true);

            setError(null);
            
            const { data , error: fetchError } = await supabaseClient
                .from('conversations')
                .select('*')
                .eq('conversation_id', id)
                .single()


            setIsLoading(false);

            if (fetchError) {
                setError(fetchError.message);
                // toast.error(fetchError.message);
                setConversation(null);
            } else {
                setConversation(data); 
            }
        };

        fetchUserInfo();

    }, [supabaseClient]);

    return { isLoading, conversation, error };
};

export default useGetConversationByConversationId
