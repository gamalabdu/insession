"use client";

import { useContext } from "react";
import ConversationItem from "./ConversationItem";
import { ConversationsContext } from "@/providers/conversations";
import { Skeleton, Spinner } from "@nextui-org/react";

const MessagesPageContent = () => {
  
  const { conversations, areLoading } = useContext(ConversationsContext);

  if (areLoading) {
    return <Loader />;
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-7 text-neutral-400">
        No conversations found.
      </div>
    );
  }

  return (
    <div
      className="
      flex
      flex-col
      gap-y-2
      w-full
      px-6
    "
    >
      {conversations.map((conversation, idx) => {
        return (
          <div key={idx} className="flex items-center gap-x-4 w-full">
            <div className="flex-1 overflow-y-auto">
              <ConversationItem {...conversation} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Loader = () => (
  <div className="flex flex-col gap-4 px-6 w-full">
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

export default MessagesPageContent;
