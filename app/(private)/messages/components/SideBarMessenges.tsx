"use client";
import useUploadModal from "@/hooks/useUploadModal";
import React, { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import ConversationItem from "./ConversationItem";
import { ConversationsContext } from "@/providers/conversations";
import { Spinner } from "@nextui-org/react";

const SideBarMessenges = () => {
  const { conversations, areLoading } = useContext(ConversationsContext);
  const uploadModal = useUploadModal();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">Your Sessions </p>
        </div>
        <AiOutlinePlus
          onClick={() => uploadModal.onOpen()}
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
    </div>
  );
};

export default SideBarMessenges;
