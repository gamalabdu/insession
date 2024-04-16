"use client";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
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
import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";

interface SidebarProps {
  children: React.ReactNode;
  songs: Song[];
  conversations: Conversation[];
}

const Sidebar = (props: SidebarProps) => {
  const { children, songs, conversations } = props;

  const pathName = usePathname();

  // const { conversations } = useGetConversationsByUserId();

  const { user } = useUser();

  const userProfileInfo = useGetUserProfileInfo(user?.id).userProfileInfo;

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
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          {routes.find((route) => route.label === "Messages")?.active ? (
            <SideBarMessenges conversations={conversations} />
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
