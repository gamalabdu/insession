"use client";
import useGetMessagesByConversationId from "@/hooks/useGetMessagesByConversationId";
import { useState } from "react";
import { ChatBubble } from "../components/ChatBubble";
import Header from "@/components/ui/Header";
import Image from "next/image";
import { FiFilePlus } from "react-icons/fi";
import Input from "@/components/Input";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GrSend } from "react-icons/gr";
import useGetConversationByConversationId from "@/hooks/useGetConversationByConversationId";
import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";

interface ConversationPageProps {
  params: {
    conversation_id: string;
  };
}

const ConversationPage = (props: ConversationPageProps) => {
  const supabaseClient = useSupabaseClient();

  const { params } = props;

  const router = useRouter();

  const { messages } = useGetMessagesByConversationId(params.conversation_id);

  const { user } = useUser();

  // const { mainUserPhoto, secondUserPhoto, mainUserName, secondUserName } = useConversationStore((state) => state.conversationData);

  const { conversation } = useGetConversationByConversationId(
    params.conversation_id
  );

  const mainUser =
    conversation?.participant_ids[0] === user?.id
      ? conversation?.participant_ids[0]
      : conversation?.participant_ids[1];

  const secondUser =
    conversation?.participant_ids[0] != user?.id
      ? conversation?.participant_ids[0]
      : conversation?.participant_ids[1];

  const mainUserPhoto =
    useGetUserProfileInfo(mainUser).userProfileInfo?.avatar_url;

  const secondUserPhoto =
    useGetUserProfileInfo(secondUser).userProfileInfo?.avatar_url;

  const [messageContent, setMessageContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    setIsLoading(true);

    try {
      const { data: messageData, error: messageError } = await supabaseClient
        .from("messages")
        .insert({
          conversation_id: params.conversation_id,
          sender_id: user?.id,
          message_type: "text",
          content: messageContent,
          seen: true,
        });

      if (messageError) {
        setIsLoading(false);
        toast.error(messageError.message);
      }
    } catch {
      console.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col bg-neutral-900 rounded-lg h-full w-full">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative rounded-md h-[100px] w-[100px]">
              {/* Main user photo */}
              <Image
                src={mainUserPhoto || "/images/liked.jpg"}
                alt="User profile"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              {/* Second user photo */}
              <div className="absolute bottom-0 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[70px] w-[70px]">
                <Image
                  src={secondUserPhoto || "/images/liked.jpg"}
                  alt="User profile"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Conversation between:
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold pl-8">
                You & {conversation?.participants_names[1]}
              </h1>
            </div>
          </div>
        </div>
      </Header>

      <div className="flex flex-col flex-grow h-0 gap-4 p-4 overflow-auto rounded-md">
        {messages?.map((message, idx) => {
          return (
            <ChatBubble
              mainUserName={conversation?.participants_names[0] || ""}
              secondUserName={conversation?.participants_names[1] || ""}
              mainUserPhoto={mainUserPhoto || ""}
              secondUserPhoto={secondUserPhoto || ""}
              message={message}
              key={message.message_id}
            />
          );
        })}
      </div>

      <div className="w-full bottom-10 h-[50px] flex flex-row align-middle p-2 gap-2">
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
          type="file"
          accept="image/*, audio/*, zip"
          className="hidden"
        />

        <Input
          type="text"
          value={messageContent}
          placeholder="type your message here..."
          onChange={(e) => setMessageContent(e.target.value)}
        />

        <div className="cursor-pointer flex flex-col align-middle justify-center">
          <GrSend
            onClick={() => sendMessage()}
            size={20}
            className="text-neutral-500 mt-1 hover:text-neutral-200"
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
