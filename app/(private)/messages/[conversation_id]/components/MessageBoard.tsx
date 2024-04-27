"use client";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble } from "../../components/ChatBubble";
import { FiFilePlus } from "react-icons/fi";
import { GrSend } from "react-icons/gr";
import Input from "@/components/Input";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import { LuFileAudio } from "react-icons/lu";
import { PiFileZip } from "react-icons/pi";
import uniqid from "uniqid";
import { createClient } from "@/utils/supabase/client";
import useDebounce from "@/hooks/useDebounce";
import { FaX } from "react-icons/fa6";
import useMessages from "@/hooks/useMessages";

interface MessagesPageProps {
  conversation: Conversation;
}

interface PresenceInfo {
  isTyping: number; // Timestamp when the user last typed
  presence_ref: string;
}

interface PresenceState {
  [userId: string]: PresenceInfo[];
}
type NewMessage = {
  files: File[];
  content: string;
};

const defaultMessage: NewMessage = {
  files: [],
  content: "",
};

const MessageBoard = ({ conversation }: MessagesPageProps) => {
  const { conversation_id } = conversation;

  const [newMessage, setNewMessage] = useState<NewMessage>(defaultMessage);

  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages } = useMessages(conversation_id);

  const otherUser = conversation.users.find((item) => item.id !== user?.id);

  const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);

  const filePreviews = useMemo(() => {
    return newMessage.files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
  }, [newMessage.files]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    const channel = supabase.channel(`presence-${conversation_id}`, {
      config: {
        presence: { key: user?.id },
      },
    });

    setIsLoading(true);

    try {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation_id,
          sender_id: user?.id,
          content: newMessage.content,
          seen: false,
        })
        .select("message_id")
        .single();

      await Promise.all(
        newMessage.files.map(async (file) => {
          const fileUniqueID = uniqid();

          const { data: messageFilesData } = await supabase.storage
            .from("messages-files")
            .upload(`${fileUniqueID}-message-file-${file.name}`, file, {
              upsert: false,
            });

          const { data: returnUrl } = supabase.storage
            .from("messages-files")
            .getPublicUrl(`${fileUniqueID}-message-file-${file.name}`);

          const { error } = await supabase.from("messages_files").insert({
            message_id: messageData?.message_id,
            url: returnUrl.publicUrl,
            type: file.type,
            file_name: file.name,
            conversation_id: conversation_id,
          });
        })
      );

      if (messageError) {
        setIsLoading(false);
        toast.error(messageError.message);
      }
    } catch {
      console.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }

    setNewMessage(defaultMessage);

    channel.track({ isTyping: false });

    setIsOtherUserTyping(false);
  };

  useEffect(() => {
    const channel = createClient().channel(`presence-${conversation_id}`, {
      config: {
        presence: { key: user?.id },
      },
    });

    const presenceChanged = () => {
      const newState: PresenceState = channel.presenceState();

      const otherUsersTyping = Object.entries(newState)

        .filter(([key]) => key !== user?.id)

        .flatMap(([, sessions]) => sessions)

        .some((session) => Date.now() - session.isTyping < 2000); // Check if last typing was within the last 2 seconds

      setIsOtherUserTyping(otherUsersTyping);
    };

    channel.on("presence", { event: "sync" }, presenceChanged).subscribe();

    const handleKeyDown = (event: KeyboardEvent) => {
      // Track typing status with a timestamp
      channel.track({ isTyping: Date.now() });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      channel.unsubscribe();
      channel.untrack().then(() => setIsOtherUserTyping(false));
    };
  }, [user?.id, conversation_id]);

  useDebounce(() => {
    setIsOtherUserTyping(false);
  }, 3000);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col flex-grow h-0 gap-4 p-6 overflow-auto rounded-md">
        {messages?.map((message, idx) => {
          return (
            <ChatBubble
              isLoading={isLoading}
              otherUser={otherUser}
              message={{ ...message, seen: true }}
              key={idx}
            />
          );
        })}

        <div ref={messagesEndRef} />
        
      </div>

      {/* Input Field */}

      {isOtherUserTyping && (
        <p className="w-full text-end p-2 text-neutral-500">
          {otherUser?.username} is typing...
        </p>
      )}

      <form
        onSubmit={sendMessage}
        className="w-full flex flex-row items-end align-middle justify-center p-2 gap-2"
      >
        <label
          htmlFor="file-input"
          className="cursor-pointer bg-orange-700 hover:bg-orange-900 text-white p-2 rounded flex items-center justify-center"
        >
          <FiFilePlus size={20} />
        </label>

        <input
          id="file-input"
          multiple
          type="file"
          accept="image/*,audio/*,.zip,application/zip,application/x-zip,application/x-zip-compressed"
          className="hidden"
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            setNewMessage((prev) => {
              // Create a map from existing files for quick lookup
              const existingFiles = new Map(
                prev.files.map((file) => [
                  `${file.name}-${file.size}-${file.lastModified}`,
                  file,
                ])
              );

              // Add new files if they don't exist in the map
              newFiles.forEach((file) => {
                const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
                if (!existingFiles.has(fileKey)) {
                  existingFiles.set(fileKey, file); // Add new file to map if not already present
                }
              });

              // Set files from map values, which includes all unique files
              return {
                ...prev,
                files: Array.from(existingFiles.values()),
              };
            });
          }}
        />

        <div className="relative flex-1">
          <div className="absolute top-1 left-3 right-3 flex flex-wrap gap-2 z-10">
            {filePreviews
              .filter(({ file }) => file.type.startsWith("image/"))
              .map(({ file, previewUrl }, index) => (
                <div key={index} className="relative">
                  <FaX
                    size={12}
                    onClick={() => {
                      setNewMessage((prev) => ({
                        ...prev,
                        files: prev.files.filter((_, idx) => idx !== index),
                      }));
                      URL.revokeObjectURL(previewUrl); // Clean up the URL immediately on removal
                    }}
                    className="cursor-pointer absolute top-0 right-0 text-neutral-500"
                    style={{ margin: "2px" }}
                  />
                  <Image
                    className="rounded object-cover"
                    width={64}
                    height={64}
                    src={previewUrl}
                    alt=""
                  />
                </div>
              ))}

            {filePreviews
              .filter(({ file }) => file.type.startsWith("audio/"))
              .map(({ file, previewUrl }, index) => (
                <div className="relative flex">
                  <FaX
                    size={10} // Adjusted for better visibility, consider your design needs
                    onClick={() => {
                      setNewMessage((prev) => ({
                        ...prev,
                        files: prev.files.filter((_, idx) => idx !== index), // Use index to filter out the file
                      }));
                    }}
                    className="cursor-pointer absolute top-0 right-1 m-1 mix-blend-difference" // margin for padding from edges
                  />
                  <div
                    className="flex flex-col gap-2 items-center align-middle justify-center w-[50px]"
                    key={index}
                  >
                    <div className="flex pt-4 pb-4 rounded-md bg-neutral-100 justify-center items-center w-[40px]">
                      <LuFileAudio size={15} className="text-neutral-500" />
                    </div>
                    <span className="flex w-full text-xs overflow-hidden text-ellipsis truncate">
                      {file.name}
                    </span>
                  </div>
                </div>
              ))}

            {filePreviews
              .filter(({ file }) => file.type.startsWith("zip/"))
              .map(({ file, previewUrl }, index) => (
                <div className="relative flex">
                  <FaX
                    size={12} // Adjusted for better visibility, consider your design needs
                    onClick={() => {
                      setNewMessage((prev) => ({
                        ...prev,
                        files: prev.files.filter((_, idx) => idx !== index), // Use index to filter out the file
                      }));
                    }}
                    className="cursor-pointer absolute top-0 right-1 m-1 mix-blend-difference" // margin for padding from edges
                  />

                  <div
                    className="flex flex-col gap-2 items-center align-middle justify-center w-[60px]"
                    key={index}
                  >
                    <div className="flex pt-4 pb-4 rounded-md bg-neutral-100 justify-center items-center w-[50px]">
                      <PiFileZip size={20} className="text-neutral-500" />
                    </div>
                    <span className="flex w-full text-xs overflow-hidden text-ellipsis truncate">
                      {file.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <Input
            type="text"
            value={newMessage.content}
            placeholder="Type your message here..."
            required={newMessage.files.length === 0}
            className={`pl-4 pr-4 pt-2 pb-2 rounded-lg w-full ${
              newMessage.files.length > 0 ? "mt-20" : "mt-3"
            }`}
            onChange={(e) =>
              setNewMessage((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center bg-orange-700 hover:bg-orange-900 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <GrSend size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageBoard;
