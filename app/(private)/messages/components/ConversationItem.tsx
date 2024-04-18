"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { IoIosMail } from "react-icons/io";
import { createClient } from "@/utils/supabase/client";
import { FaX } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Skeleton } from "@nextui-org/react";
import DeleteConversationModal from "./DeleteConversationModal";

const ConversationItem = ({
  conversation_id,
  users,
  latest_message,
}: ConversationWithMessage) => {
  const router = useRouter();

  const { user } = useUser();

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const supabase = createClient();

  const { messages_files, content, sender_id } = latest_message;

  const otherUser = users.find((item) => item.id !== user?.id);

  const handleUsernameClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    router.push(`/profile?id=${otherUser?.id}`);
  };

  const handleRemoveClick = (
    event: React.MouseEvent<SVGElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Stop event from propagating to higher levels
    setDeleteLoading(true); // Show loading indication
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("conversation_id", conversation_id);

    if (error) {
      toast.error("Failed to delete the conversation: " + error.message);
      setDeleteLoading(false);
    } else {
      toast.success("Conversation deleted successfully");
      setIsDeleted(true);
      router.push("/messages"); // Redirect only after successful deletion
    }
    setDeleteModalOpen(false);
  };

  const handleClick = async (conversation_id: string) => {
    if (isDeleted) return;

    try {
      // Step 1: Fetch messages that have not been seen
      const { data: messagesToBeUpdated, error: selectError } = await supabase
        .from("messages")
        .select("message_id")
        .eq("conversation_id", conversation_id)
        .eq("seen", false);

      if (selectError) {
        throw selectError;
      }

      // Check if there are any messages to update
      if (messagesToBeUpdated.length > 0) {
        // Step 2: Update these messages to mark as seen
        const { error: updateError } = await supabase
          .from("messages")
          .update({ seen: true })
          .in(
            "message_id",
            messagesToBeUpdated.map((msg) => msg.message_id)
          );

        if (updateError) {
          throw updateError;
        }
      }
    } catch (error) {
      console.log(error || "An unexpected error occurred");
    } finally {
      // Navigate to the conversation page
      router.push(`/messages/${conversation_id}`);
    }
  };

  if (!otherUser) {
    return (
      <div>
        <span>The other user has not been found</span>
      </div>
    );
  }

  if (deleteLoading) {
    return (
      <div className="flex align-middle items-center gap-5">
        <div>
          <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => handleClick(conversation_id)}
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
            className="absolute right-0 bottom-0"
            color="red"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center p-2 truncate">
        <span
          onClick={handleUsernameClick}
          className="text-sm mt-1 text-neutral-500 hover:text-neutral-400 hover:underline"
        >
          <span>{otherUser.username}</span>
        </span>
        <p className="text-neutral-400 text-base truncate">
          {sender_id === user?.id && "You:"}{" "}
          {messages_files && messages_files.length > 0
            ? messages_files.length === 1
              ? messages_files[0].type.includes("image")
                ? "Sent an image"
                : "Sent a file"
              : `Sent ${messages_files.length} files`
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

      <FaX
        onClick={handleRemoveClick}
        size={12}
        color="#a3a3a3"
        style={{ cursor: "pointer", fontWeight: "bold" }}
      />

      <DeleteConversationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ConversationItem;
