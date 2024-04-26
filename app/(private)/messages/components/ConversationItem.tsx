"use client";
import { Fragment, useContext, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { IoIosMail } from "react-icons/io";
import { FaX } from "react-icons/fa6";
import DeleteConversationModal from "./DeleteConversationModal";
import Link from "next/link";
import { ConversationsContext } from "@/providers/conversations";

const ConversationItem = ({
  conversation_id,
  users,
  latest_message,
}: ConversationWithMessage) => {
  const { onlineUsers } = useContext(ConversationsContext);
  const router = useRouter();
  const { user } = useUser();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { files, content, sender_id } = latest_message;
  const otherUser = users.find((item) => item.id !== user?.id);

  const handleUsernameClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    router.push(`/profile?id=${otherUser?.id}`);
  };

  const handleRemoveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDeleteModalOpen(true);
  };

  

  if (!otherUser) {
    return (
      <div>
        <span>The other user has not been found</span>
      </div>
    );
  }


  return (
    <Fragment>
      <Link
        href={`/messages/${conversation_id}`}
        className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md items-center align-middle"
      >
        {/* overflow-hidden */}
        <div className="aspect-square h-[70px] relative rounded-full bg-gray-200">
          <Image
            src={otherUser.avatar_url}
            alt="User profile"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {sender_id != user?.id && latest_message?.seen != true && (
            <IoIosMail
              size={20}
              className="absolute right-0 bottom-0 text-orange-600"
              color=""
            />
          )}
          <div
            className={`absolute bottom-0 left-0 border rounded-full h-4 w-4 ${
              onlineUsers.includes(otherUser.id)
                ? "border-white bg-green-500"
                : "bg-neutral-500 border-neutral-400"
            }`}
          ></div>
        </div>

        <div className="flex-1 flex flex-col justify-center p-2 truncate">
          <span
            onClick={handleUsernameClick}
            className="text-sm mt-1 text-neutral-500 hover:text-neutral-400 hover:underline max-w-max"
          >
            <span>{otherUser.username}</span>
          </span>
          <p className="text-neutral-400 text-base truncate">
            {sender_id === user?.id && "You:"}{" "}
            {files && files.length > 0
              ? files.length === 1
                ? files[0].type.includes("image")
                  ? "Sent an image"
                  : "Sent a file"
                : `Sent ${files.length} files`
              : content}
            <time className="text-xs opacity-50 ml-1">
              sent at :{" "}
              {new Date(latest_message?.sent_at as string).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </time>
          </p>
        </div>

        <button onClick={handleRemoveClick}>
          <FaX
            size={12}
            color="#a3a3a3"
            style={{ cursor: "pointer", fontWeight: "bold" }}
          />
        </button>
      </Link>
      <DeleteConversationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        conversation_id={conversation_id}
      />
    </Fragment>
  );
};

export default ConversationItem;
