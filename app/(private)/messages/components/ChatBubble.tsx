"use client";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { LuFileAudio } from "react-icons/lu";
import { PiFileZip } from "react-icons/pi";

interface ChatBubbleProps {
  message: MessageWithFiles;
  otherUser?: Profile;
  isLoading: boolean;
}

type GroupedFiles = {
  [key: string]: StorageFile[];
};

export const ChatBubble = (props: ChatBubbleProps) => {
  const { message, otherUser, isLoading } = props;

  const { user, userDetails, isLoading: loading } = useUser();

  const isSignedIn = user?.id === message.sender_id;

  if (loading.profile) {
    return <></>;
  }

  const avatarUrl = isSignedIn
    ? userDetails?.avatar_url
    : otherUser?.avatar_url;

  const { images, audio, zip }: GroupedFiles = message.files
    ? message.files.reduce(
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
      )
    : { images: [], audio: [], zip: [] };

  return (
    <div className={`flex ${!isSignedIn ? "justify-start" : "justify-end"}`}>
      <div className="mb-1 flex justify-center align-middle mr-2">
        {avatarUrl && (
          <div className="relative rounded-md h-[48px] w-[48px]">
            <Image
              src={avatarUrl}
              alt="userPhoto"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-cover"
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
            {isSignedIn ? userDetails?.username : otherUser?.username}
          </div>
        </div>
      </div>

      <div
        className={`${
          !isSignedIn
            ? " flex bg-neutral-700 rounded-md w-1/2 max-w-fit p-2"
            : "flex flex-col bg-neutral-600 rounded-md w-1/2 max-w-fit p-2"
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
            {images.map((item, idx) => (
              <div className="relative h-[60px] w-[60px]" key={idx}>
                <Image
                  fill
                  className="object-contain"
                  src={item.url}
                  alt="message-image"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        )}

        {audio.length > 0 && (
          <div className={"w-full grid gap-2 p-5 bg-neutral-800 rounded-md"}>
            {audio.map((item, idx) => (
              <div className="w-full flex-grow" key={idx}>
                <LuFileAudio />
                <span className="w-full">{item.file_name}</span>
                <audio controls className="w-full" src={item.url}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        )}

        {zip.length > 0 && (
          <div className={"w-full grid gap-2 p-5 bg-neutral-800 rounded-md"}>
            {zip.map((item, idx) => (
              <div className="relative" key={idx}>
                <PiFileZip />
                <a
                  href={item.url}
                  download={item.file_name}
                  className="download-link text-neutral-300 hover:text-neutral-500 underline"
                >
                  Download {item.file_name}
                </a>
              </div>
            ))}
          </div>
        )}
        {!message.content && message.files.length === 0 ? (
          <div className="h-full w-full grid place-content-center flex-1 px-2">
            <Spinner color="white" size="sm" />
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};
