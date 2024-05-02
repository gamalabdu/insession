"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Button from "../Button";
import Image from "next/image";

interface UserProfileMenuProps {
  userProfileInfo: Profile;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = (
  props: UserProfileMenuProps
) => {
  const { userProfileInfo } = props;

  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <Button className="bg-transparent" onClick={() => setMenuOpen(!isMenuOpen)}>
        <div className="aspect-square h-[40px] relative rounded-full bg-gray-200">
          <Image
            src={userProfileInfo.avatar_url}
            alt="User profile"
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Button>
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-lg z-10"
        >
          <Link
            href="/account"
            className="block px-4 py-2 text-base text-neutral-200 hover:bg-neutral-700 first:rounded-t-lg last:rounded-b-lg"
          >
            Account
          </Link>
          <Link
            href={`/profile?id=${userProfileInfo.id}`}
            className="block px-4 py-2 text-base text-neutral-200 hover:bg-neutral-700 last:rounded-b-lg"
          >
            Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
