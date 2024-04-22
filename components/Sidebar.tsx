"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { MdTableRows } from "react-icons/md";
import SideBarMessenges from "@/app/(private)/messages/components/SideBarMessenges";
import { useUser } from "@/hooks/useUser";
import { ConversationsContext } from "@/providers/conversations";
import { createClient } from "@/utils/supabase/client";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
}

const Sidebar = ({ children, songs }: SidebarProps) => {
  const [unseenMessages, setUnseenMessages] = useState(0);

  const { conversations, areLoading } = useContext(ConversationsContext);

  const pathName = usePathname();

  const { user } = useUser();

  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathName === "/dashboard",
        href: "/dashboard",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: pathName === "/search",
        href: "/search",
      },
      {
        icon: MdOutlineTravelExplore,
        label: "Explore",
        active: pathName === "/explore",
        href: "/explore",
      },
      {
        icon: FiMessageSquare,
        label: "Messages",
        active: pathName.startsWith("/messages"),
        href: "/messages",
      },
      {
        icon: MdTableRows,
        label: "Sessions",
        active: pathName === "/sessions",
        href: "/sessions",
      },
    ],
    [pathName]
  );

  useEffect(() => {
    const supabase = createClient();
    const fetchUnseenMessages = async () => {
      if (!user?.id) return; // Ensure user is defined

      const conversationIds = conversations.map((conv) => conv.conversation_id);
      if (conversationIds.length === 0) {
        setUnseenMessages(0);
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("seen", false)
        .in("conversation_id", conversationIds)
        .neq("sender_id", user.id);

      if (error) {
        console.error("Error fetching unseen messages:", error.message);
        setUnseenMessages(0);
        return;
      }

      setUnseenMessages(data.length);
    };

    fetchUnseenMessages();
  }, [conversations, user]);

  return (
    <div
      className={twMerge(
        `
    flex
    h-full
    `,
        player.activeId && "h-[calc(100%-80px)]"
      )}
    >
      {/* <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2"> */}
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] pl-2 pt-2 pb-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((item) => (
              <SidebarItem
                key={item.label}
                unseenMessages={unseenMessages}
                {...item}
              />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          {routes.find((route) => route.label === "Messages")?.active ? (
            <SideBarMessenges />
          ) : (
            <Library songs={songs} />
          )}
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2 pr-2 pl-2">
        {children}
      </main>
    </div>
  );
};

export default Sidebar;
