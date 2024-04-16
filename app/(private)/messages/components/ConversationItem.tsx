"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const ConversationItem = ({
  conversation_id,
  users,
  latest_message,
}: ConversationWithMessage) => {
  const router = useRouter();
  const { user } = useUser();

  const otherUser = users.find((item) => item.id !== user?.id);

  const handleClick = (conversation_id: string) => {
    router.push(`/messages/${conversation_id}`);
  };

  if (!otherUser) {
    return (
      <div>
        <span>The other user has not been found</span>
      </div>
    );
  }

  const sender = users.find((item) => item.id === latest_message?.sender_id);

  return (
    <div
      onClick={() => handleClick(conversation_id)}
      className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="aspect-square h-[70px] relative overflow-hidden rounded-full bg-gray-200">
        <Image
          src={otherUser.avatar_url}
          alt="User profile"
          layout="fill"
          objectFit="cover"
          className="rounded-full" // Changed from rounded-md to rounded-full
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center p-2 truncate">
        <span
          onClick={() => router.push(`/profile?id=${otherUser.id}`)}
          className="text-sm mt-1 text-neutral-500 hover:text-neutral-400 hover:underline"
        >
          {otherUser.username}
        </span>
        <p className="text-neutral-400 text-base truncate">
          {sender?.id === user?.id && "You:"} {latest_message?.content}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
