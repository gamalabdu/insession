import ConversationItem from "./ConversationItem";

type Props = {
  conversations: Conversation[];
};

const MessagesPageContent = ({ conversations }: Props) => {
  if (conversations?.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-7 text-neutral-400">
        No conversations found.
      </div>
    );
  }

  return (
    <div
      className="
      flex
      flex-col
      gap-y-2
      w-full
      max-w-5xl
      px-6
    "
    >
      {conversations?.map((conversation, idx) => {
        return (
          <div key={idx} className="flex items-center gap-x-4 w-full">
            <div className="flex-1 overflow-y-auto">
              <ConversationItem {...conversation} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessagesPageContent;
