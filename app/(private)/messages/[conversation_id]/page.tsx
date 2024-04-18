import Header from "@/components/ui/Header";
import MessageBoard from "./components/MessageBoard";
import { getConversation } from "@/actions/messages";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import ClientModalHandler from "./components/ClientFileModalHandler";

interface ConversationPageProps {
  params: {
    conversation_id?: string;
  };
}

const ConversationPage = async ({
  params: { conversation_id },
}: ConversationPageProps) => {
  if (!conversation_id) {
    return notFound();
  }
  const {
    results: [conversation],
    error,
  } = await getConversation(conversation_id);

  if (error || !conversation) {
    throw new Error(error || "Not found");
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUser = conversation.users.find((item) => item.id === user?.id);
  const otherUser = conversation.users.find((item) => item.id !== user?.id);
  return (
    <div className="flex flex-col bg-neutral-900 overflow-hidden rounded-lg h-full w-full">
      <Header>
        <div className="mt-20 flex">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative rounded-md h-[100px] w-[100px] ">
              <Image
                src={otherUser?.avatar_url || "/images/userIcon.png"}
                alt="User profile"
                fill
                objectFit="cover"
                className="rounded-md"
              />
              <div className="absolute bottom-0 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[70px] w-[70px]">
                <Image
                  src={currentUser!.avatar_url}
                  alt="User profile"
                  fill
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Conversation between:
              </p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold pl-8">
                You & {otherUser?.username}
              </h1>
            </div>

            <ClientModalHandler conversation_id={conversation_id} />
          </div>
        </div>
      </Header>

      <MessageBoard conversation={conversation} />
    </div>
  );
};

export default ConversationPage;
