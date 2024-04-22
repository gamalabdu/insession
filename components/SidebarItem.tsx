"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
  unseenMessages: number;
}

const SidebarItem = (props: SidebarItemProps) => {
  const { icon: Icon, label, active, href, unseenMessages } = props;

  return (
    <Link
      href={href}
      className={twMerge(
        `
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

      {label === "Messages" && unseenMessages > 0 ? (
        <div className="flex-1 flex justify-between items-center">
          <span className="truncate">{label}</span>
          <span className="flex items-center justify-center h-6 w-6 bg-orange-600 text-white rounded-full text-sm">
            {unseenMessages}
          </span>
        </div>
      ) : (
        <p className="truncate w-full"> {label} </p>
      )}
    </Link>
  );
};

export default SidebarItem;
