import Header from "@/components/ui/Header";
import Image from "next/image";
import MessageBoard from "./components/MessageBoard";
import getAllConversations from "@/actions/getAllUserConversations";
import ClientModalHandler from "./components/ClientFileModalHandler";


interface ConversationPageProps {
  params: {
    conversation_id: string;
  };
}

const ConversationPage = async (props: ConversationPageProps) => {

  const { params } = props;

  const conversations = await getAllConversations();

  const currentConversation = conversations.filter(
    (conversation) => conversation.conversation_id === params.conversation_id
  )[0];



  return (
    <div className="flex flex-col bg-neutral-900 rounded-lg h-full w-full">
      <Header>
        <div className="mt-20 flex">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative rounded-md h-[100px] w-[100px] ">
              <Image
                src={
                  currentConversation.conversation_participants[0].profiles
                    .avatar_url || "/images/liked.jpg"
                }
                alt="User profile"
                fill
                objectFit="cover"
                className="rounded-md"
              />

              <div className="absolute bottom-0 right-0 translate-x-2/4 translate-y-1/4 rounded-md overflow-hidden h-[70px] w-[70px]">
                <Image
                  src={
                    currentConversation.conversation_participants[1].profiles
                      .avatar_url
                  }
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
                You &{" "}
                {
                  currentConversation.conversation_participants[0].profiles
                    .username
                }
              </h1>
            </div>

              <ClientModalHandler conversation_id={params.conversation_id} />


          </div>
        </div>
      </Header>

      <MessageBoard
        conversation_id={params.conversation_id}
        currentConversation={currentConversation}
      />

    </div>
  );
}

export default ConversationPage;
