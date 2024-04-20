"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
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
import useMessages from "@/hooks/useMessages";
import { createClient } from "@/utils/supabase/client";
import useDebounce from "@/hooks/useDebounce";

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

  const supabase = createClient();

  const channel = supabase.channel(`presence-${conversation_id}`, {
    config: {
      presence: { key: user?.id },
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

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
    const supabase = createClient();

    const channel = supabase.channel(`presence-${conversation_id}`, {
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
    channel.track({ isTyping: false });
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
        className="w-full bottom-10 flex flex-row items-end p-4 gap-2"
      >
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col align-middle justify-center"
        >
          <FiFilePlus
            size={22}
            className="text-neutral-500 mt-1 hover:text-neutral-200"
          />
        </label>

        <input
          id="file-input"
          multiple
          type="file"
          accept="image/*,audio/*, .zip,application/zip,application/x-zip,application/x-zip-compressed"
          className="hidden"
          onChange={(e) =>
            setNewMessage((prev) => ({
              ...prev,
              files: Array.from(e.target.files || []),
            }))
          }
        />

        <div className="relative flex-1 h-full">
          <div className="flex items-center gap-2 absolute top-3 left-3">
            {newMessage.files
              .filter((item) => item.type.startsWith("image/"))
              .map((item) => (
                <Image
                  className="rounded object-cover"
                  width={64}
                  height={64}
                  src={URL.createObjectURL(item)}
                  key={item.name}
                  alt=""
                />
              ))}
            {newMessage.files
              .filter((item) => item.type.startsWith("audio/"))
              .map((item) => (
                <div
                  className="flex flex-col items-center gap-1"
                  key={item.type + item.name}
                >
                  <LuFileAudio size={24} /> {item.name}
                </div>
              ))}
            {newMessage.files
              .filter((item) => item.type.includes("zip"))
              .map((item) => (
                <div
                  className="flex flex-col items-center gap-1"
                  key={item.type + item.name}
                >
                  <PiFileZip size={24} /> {item.name}
                </div>
              ))}
          </div>
          <Input
            type="text"
            value={newMessage.content}
            placeholder="type your message here..."
            className={`${
              newMessage.files.length > 0 ? "pt-20" : ""
            } max-h-full`}
            onChange={(e) =>
              setNewMessage((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </div>

        <div className="cursor-pointer flex flex-col align-middle justify-center">
          {isLoading ? (
            <Spinner size="sm" color="default" />
          ) : (
            <button type="submit">
              <GrSend
                size={20}
                className="text-neutral-500 mt-1 hover:text-neutral-200"
              />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageBoard;
