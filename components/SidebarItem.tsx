"use client"
import useMessages from '@/hooks/useMessages'
import { useUser } from '@/hooks/useUser'
import { ConversationsContext } from '@/providers/conversations'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'


interface SidebarItemProps {
    icon: IconType
    label: string
    active?: boolean,
    href: string
}

const SidebarItem = (props: SidebarItemProps) => {

    const { icon: Icon, label, active, href } = props

    const [unseenMessages, setUnseenMessages ] = useState(0)

    const { conversations , areLoading } = useContext(ConversationsContext);

    const { user } = useUser()

    const supabase = createClient();

    useEffect(() => {
        const fetchUnseenMessages = async () => {
            if (!user?.id) return; // Ensure user is defined

            const conversationIds = conversations.map(conv => conv.conversation_id);
            if (conversationIds.length === 0) {
                setUnseenMessages(0);
                return;
            }

            const { data, error } = await supabase
                .from('messages')
                .select('*', { count: 'exact' })
                .eq('seen', false)
                .in('conversation_id', conversationIds);

            if (error) {
                console.error('Error fetching unseen messages:', error.message);
                setUnseenMessages(0);
                return;
            }

            setUnseenMessages(data.length);
        };

        fetchUnseenMessages();

    }, [conversations, user]);


    console.log(unseenMessages)


    return (
        <Link
            href={href}
            className={twMerge(`
        flex
        flex-row
        h-auto
        items-center
        w-full
        gap-x-4
        text-md
        font-medium
        cursor-pointer
        hover:text-white
        transition
        text-neutral-400
        py-1
        `,
                active && "text-white"
            )}
        >
            <Icon size={26} />
   
               {
                label === 'Messages' && unseenMessages != 0 ? 

                <div className='flex-1 flex justify-between items-center'>
                        <span className='truncate'>{label}</span>
                        <span className='flex items-center justify-center h-6 w-6 bg-orange-600 text-white rounded-full text-sm'>
                            {unseenMessages}
                        </span>
                    </div>

                : 

                <p className='truncate w-full'> {label} </p>

               }



       

        </Link>
    )
}

export default SidebarItem