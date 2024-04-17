import Header from "@/components/ui/Header";
import SearchInput from "@/components/SearchInput";
import React from "react";
import MessagesPageContent from "./components/MessagesPageContent";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  
  const supabase = createClient();

  const roomOne = supabase.channel("room_01");

  roomOne
    .on("presence", { event: "sync" }, () => {
      const newState = roomOne.presenceState();
      console.log("sync", newState);
    })
    .on("presence", { event: "join" }, ({ key, newPresences }) => {
      console.log("join", key, newPresences);
    })
    .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      console.log("leave", key, leftPresences);
    })
    .subscribe();

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

      <MessagesPageContent />
    </div>
  );
}
