"use client";
import { ConversationReturnItem, Message } from "@/types";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { ChatBubble } from "../../components/ChatBubble";
import { FiFilePlus } from "react-icons/fi";
import { GrSend } from "react-icons/gr";
import Input from "@/components/Input";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/hooks/useUser";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import { BiPlusCircle } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { LuFileAudio } from "react-icons/lu";
import { PiFileZip } from "react-icons/pi";

interface MessagesPageProps {
  conversation_id: string;
  currentConversation: ConversationReturnItem;
}

type NewMessage = {
  files: File[];
  content: string;
};

const defaultMessage: NewMessage = {
  files: [],
  content: "",
};

const MessageBoard = (props: MessagesPageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<NewMessage>(defaultMessage);
  const { conversation_id, currentConversation } = props;

  const supabase = createClient();

  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const secondUser = currentConversation.conversation_participants.find(
    (item) => item.profiles.id !== user?.id
  )?.profiles;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*, messages_files(id, url, type)")
        .eq("conversation_id", conversation_id)
        .order("sent_at", { ascending: true });
      console.log(data);
      data && setMessages(data);
    })();
    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.conversation_id === conversation_id) {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        }
      )
      .subscribe();
  }, [conversation_id]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation_id,
          sender_id: user?.id,
          content: newMessage.content,
          seen: true,
        })
        .select("message_id")
        .single();
      await Promise.all(
        newMessage.files.map(async (file) => {
          const { data } = await supabase.storage
            .from("messages-files")
            .upload(file.name, file, {
              upsert: false,
            });
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("messages-files")
            .getPublicUrl(data?.path || "");
          const { error } = await supabase.from("messages_files").insert({
            message_id: messageData?.message_id,
            url: publicUrl,
            type: file.type,
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
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-grow h-0 gap-4 p-4 overflow-auto rounded-md">
        {messages?.map((message, idx) => {
          return (
            <ChatBubble
              secondUser={secondUser || null}
              message={message}
              key={message.message_id}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="w-full bottom-10 h-[50px] flex flex-row items-end  p-2 gap-2"
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

        <div className="relative flex-1">
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
