"use client";
import React from "react";
import Image from "next/image";
import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";
import useGetMessagesByConversationId from "@/hooks/useGetMessagesByConversationId";
import { useRouter } from "next/navigation";
import { ConversationReturnItem } from "@/types";
import drakePic from "../../../../public/images/liked.jpg";
import { useUser } from "@/hooks/useUser";

interface ConversationItemProps {
  conversation: ConversationReturnItem;
}

const ConversationItem = (props: ConversationItemProps) => {
  const router = useRouter();

  const { conversation } = props;

  const { user, userDetails } = useUser();

  console.log(user, userDetails);

  const { messages } = useGetMessagesByConversationId(
    conversation.conversation_id
  );

  const lastMessage =
    messages && messages.length > 0 ? messages[messages.length - 1] : null;

  const handleClick = (conversation_id: string) => {
    router.push(`/messages/${conversation_id}`);
  };

  const restUser = conversation.conversation_participants.filter(
    (user) => user.profiles.id !== userDetails?.id
  )[0].profiles;

  console.log(restUser);

  return (
    <div
      onClick={() => handleClick(conversation.conversation_id)}
      className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full  p-2 rounded-md"
    >
      <div className="relative rounded-md h-[100px] w-[100px]">
        <Image
          src={restUser.avatar_url || "/../public/images/liked.jpg"}
          alt="User profile"
          objectFit="cover"
          className="rounded-md"
          fill
        />

        <div className="absolute bottom-3 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[60px] w-[60px]">
          <Image
            src={userDetails?.avatar_url || "/../public/images/liked.jpg"}
            alt="User profile"
            objectFit="cover"
            fill
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-4 overflow-hidden w-full">
        <p className="text-white text-xl truncate">
          You & {conversation.conversation_participants[1].profiles.username}
        </p>
        <p className="text-neutral-400 text-lg truncate pl-4 overflow-hidden w-full">
          {lastMessage?.content}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
