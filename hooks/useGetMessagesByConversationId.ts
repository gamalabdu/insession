import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Message } from "@/types";
import { useUser } from "./useUser";

const useGetMessagesByConversationId = (conversation_id: string) => {

    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { supabaseClient } = useSessionContext();

    const { user } = useUser()

    useEffect(() => {

        if (!user?.id) {
            setMessages(null);
            setError('No ID provided');
            return;
        }

        const fetchUserInfo = async () => {

            setIsLoading(true);

            setError(null);
            
            const { data , error: fetchError } = await supabaseClient
                .from('messages')
                .select('*')
                .eq('conversation_id', conversation_id)
                .order('sent_at', { ascending: true })


            setIsLoading(false);

            if (fetchError) {
                setError(fetchError.message);
                toast.error(fetchError.message);
                setMessages(null);
            } else {
                setMessages(data); 
            }
        };


        fetchUserInfo();



    }, [supabaseClient]);

    return { isLoading, messages, error };
};

export default useGetMessagesByConversationId






