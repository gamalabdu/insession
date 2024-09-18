"use client";
import React, { useContext, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ConversationItem from "./ConversationItem";
import { ConversationsContext } from "@/providers/conversations";
import { Skeleton, Spinner } from "@nextui-org/react";
import { FiMessageSquare } from "react-icons/fi";
import SideMessageModal from "@/components/modals/SideMessageModal";


const SideBarMessenges = () => {

  const { conversations , areLoading } = useContext(ConversationsContext);

  const [sideMessageModalOpen, setSideMessageModalOpen] = useState<boolean>(false)

  if (areLoading) {
    return <Loader />;
  }


  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <FiMessageSquare size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">Your Messages </p>
        </div>
        <AiOutlinePlus
          onClick={() => setSideMessageModalOpen(true)}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transtion"
        />
      </div>

      {areLoading ? (
        <div className="flex flex-col gap-y-2 mt-6 w-full items-center px-6 text-neutral-400">
          <Spinner size="sm" color="white" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col gap-y-4 mt-5 w-full px-6 text-neutral-400">
          No conversations found.
        </div>
      ) : (
        <div className="flex flex-col gap-y-2 mt-4 px-3">
          {conversations?.map((conversation, idx) => (
            <ConversationItem {...conversation} key={idx} />
          ))}
        </div>
      )}

      <SideMessageModal sideMessageModalOpen={sideMessageModalOpen} setSideMessageModalOpen={setSideMessageModalOpen} />

    </div>
  );
};




const Loader = () => (
  <div className="flex flex-col gap-4 px-6 w-full h-full pt-7">
    <div className="w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
    <div className=" w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
    <div className="w-full flex items-center gap-3"> 
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  </div>
);

export default SideBarMessenges;
