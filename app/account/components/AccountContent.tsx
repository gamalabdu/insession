"use client";
import getUserProfileInfo from "@/actions/getUserProfileInfo";
import useLoadProfileImage from "@/hooks/useLoadProfileImage";
import { Profile } from "@/types";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import { twMerge } from "tailwind-merge";
import useProfileSetupModal from "@/hooks/useProfileSetupModal";
import Button from "@/components/Button";
import useEditProfileModal from "@/hooks/useEditProfileModal";

interface AccountContentProps {
  userProfileInfo: Profile | null;
}

const AccountContent = (props: AccountContentProps) => {

  const { userProfileInfo } = props;

  console.log(userProfileInfo?.avatar_url)

  const editProfileModal = useEditProfileModal()

  const displayClassName = `
  flex
                    w-full
                    rounded-md
                    bg-neutral-700
                    border
                    border-transparent
                    px-3
                    py-3
                    text-sm
                    file:border-0
                    file:bg-transparent
                    file:text-sm
                    file:font-medium
                    placeholder:text-neutral-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    focus:outline-none
  `;


  return (
    <div>
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src={userProfileInfo?.avatar_url || "/images/liked.jpg"}
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Account Settings
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                Account
              </h1>
              <Button onClick={() => editProfileModal.onOpen() }>
                Edit Account Info
              </Button>
            </div>
          </div>
        </div>
      </Header>

  <div className="flex justify-center w-full">
        <div className="flex flex-col h-full w-full max-w-5xl mt-2">

            <div className="flex flex-col items-center align-middle w-full p-3">
                <p className="w-full pb-1 pl-1 text-neutral-300"> Display Name : </p>
                <p className={displayClassName}>{userProfileInfo?.username}</p>
            </div>

            <div className="flex flex-col items-center align-middle w-full p-3">
                <p className="w-full pb-1 pl-1 text-neutral-300"> Email : </p>
                <p className={displayClassName}>{userProfileInfo?.email}</p>
            </div>

        </div>
    </div>




    </div>
  );
};

export default AccountContent;
