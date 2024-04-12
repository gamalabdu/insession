
import Header from "@/components/ui/Header";
import SearchInput from "@/components/SearchInput";
import React from "react";
import MessagesContent from "./components/MessagesContent";
import getAllUserConversations from "@/actions/getAllUserConversations";


const Messages = async () => {

  const conversations = await getAllUserConversations();

  return (
    <div
      className="
        bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
        "
    >
      
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold"> Messages </h1>
          <SearchInput
            baseRoute="/messages"
            placeholder="Look up your messages..."
          />
        </div>
      </Header>

      <MessagesContent conversations={conversations} />

    </div>
  );
};

export default Messages;
