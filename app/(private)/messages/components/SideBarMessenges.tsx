"use client";
import useUploadModal from "@/hooks/useUploadModal";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import ConversationItem from "./ConversationItem";

type Props = {
  conversations: Conversation[];
};

const SideBarMessenges = ({ conversations }: Props) => {
  const uploadModal = useUploadModal();

  if (conversations?.length === 0 || conversations === null) {
    <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
      No conversations found.
    </div>;
  }
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

      {conversations?.length === 0 || conversations === null ? (
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
