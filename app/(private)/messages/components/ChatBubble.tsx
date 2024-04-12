"use client";
import { useUser } from "@/hooks/useUser";
import { Message, Profile, StorageFile } from "@/types";
import Image from "next/image";
import React from "react";

interface ChatBubbleProps {
  message: Message;
  secondUser: Profile | null;
}

type GroupedFiles = {
  [key: string]: StorageFile[];
};

export const ChatBubble = (props: ChatBubbleProps) => {
  const { message, secondUser } = props;

  const { user, userDetails, isLoading } = useUser();

  const isSignedIn = user?.id === message.sender_id;

  if (isLoading.profile) {
    return <></>;
  }

  const avatarUrl = isSignedIn
    ? userDetails?.avatar_url
    : secondUser?.avatar_url;

  const { images, audio, zip }: GroupedFiles = message.messages_files.reduce(
    (prev, curr) =>
      curr.type.startsWith("image")
        ? { ...prev, images: [...prev.images, curr] }
        : curr.type.startsWith("audio")
        ? { ...prev, audio: [...prev.audio, curr] }
        : { ...prev, zip: [...prev.zip, curr] },
    {
      images: [],
      audio: [],
      zip: [],
    } as GroupedFiles
  );

  return (
    <div className={`flex ${!isSignedIn ? "justify-start" : "justify-end"}`}>
      <div className="mb-1 flex justify-center align-middle mr-2">
        {avatarUrl && (
          <div className="relative rounded-md h-[48px] w-[48px]">
            <Image
              src={avatarUrl}
              alt="userPhoto"
              objectFit="cover"
              fill
              className="rounded-md"
            />
          </div>
        )}

        <div className="flex flex-col">
          <time className="text-xs opacity-50 ml-1">
            {new Date(message.sent_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </time>
          <div className="ml-1 opacity-50">
            {isSignedIn ? userDetails?.username : secondUser?.username}
          </div>
        </div>
      </div>

      <div
        className={`${
          !isSignedIn
            ? " bg-neutral-700 rounded-md p-2 w-1/2 "
            : "flex bg-neutral-500 rounded-md p-2 w-1/2"
        }`}
      >
        {images.length > 0 && (
          <div
            className={`w-full grid gap-2 ${
              images.length > 2
                ? "grid-cols-3"
                : images.length === 1
                ? "grid-cols-1"
                : "grid-cols-2"
            }`}
          >
            {images.map((item) => (
              <div className="relative" key={item.url}>
                <Image fill className="object-contain" src={item.url} alt="" />
              </div>
            ))}
          </div>
        )}
        {message.content}
      </div>
    </div>
  );
};
