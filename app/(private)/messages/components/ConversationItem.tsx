// "use client";
// import React from "react";
// import Image from "next/image";
// import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";
// import useGetMessagesByConversationId from "@/hooks/useGetMessagesByConversationId";
// import { useRouter } from "next/navigation";
// import { ConversationReturnItem } from "@/types";
// import drakePic from "../../../../public/images/liked.jpg";
// import { useUser } from "@/hooks/useUser";

// interface ConversationItemProps {
//   conversation: ConversationReturnItem;
// }

// const ConversationItem = (props: ConversationItemProps) => {

//   const router = useRouter();

//   const { conversation } = props;

//   const { user, userDetails } = useUser();

//   const { messages } = useGetMessagesByConversationId(
//     conversation.conversation_id
//   );

//   const user2 = conversation.conversation_participants.filter((participant) => participant.profiles.id != userDetails?.id)[0].profiles

//   const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;

//   console.log("This is lastMessage : ", lastMessage?.messages_files)

//   const handleClick = (conversation_id: string) => {
//     router.push(`/messages/${conversation_id}`);
//   };


//   return (
//     <div  onClick={() => handleClick(conversation.conversation_id)}
//       className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full h-full p-2 rounded-md border"
//     >



//       {/* <div className="relative rounded-md h-[80px] w-[80px] aspect-square"> */}
//       <div className="relative rounded-md overflow-hidden aspect-square border"> 

//         <Image
//           src={user2.avatar_url || "/../public/images/liked.jpg"}
//           alt="User profile"
//           objectFit="cover"
//           className="rounded-md"
//           fill
//         />

//         <span>{user2.username}</span>
        
//       </div>

//       <div className="flex flex-col gap-y-4 overflow-hidden w-full justify-center align-middle">

//         <p className="text-neutral-400 text-lg truncate pl-4 overflow-hidden w-full">
//           {lastMessage?.content}
//         </p>

//       </div>

//     </div>
//   );
// };

// export default ConversationItem;















"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConversationReturnItem } from "@/types";
import { useUser } from "@/hooks/useUser";
import useGetMessagesByConversationId from "@/hooks/useGetMessagesByConversationId";

interface ConversationItemProps {
  conversation: ConversationReturnItem;
}

const ConversationItem = (props: ConversationItemProps) => {

  const router = useRouter();
  const { conversation } = props;
  const { user, userDetails } = useUser();
  const { messages } = useGetMessagesByConversationId(conversation.conversation_id);


  const user2 = conversation.conversation_participants
    .filter((participant) => participant.profiles.id !== userDetails?.id)[0]
    .profiles;

  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;

  const handleClick = (conversation_id: string) => {
    router.push(`/messages/${conversation_id}`);
  };

  return (
    <div onClick={() => handleClick(conversation.conversation_id)}
      className="flex gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >

        {/* <div className="aspect-square h-[80px] relative overflow-hidden rounded-md bg-gray-200">
          <Image
            src={user2.avatar_url || "/images/default-avatar.jpg"} // Ensure the path is correct
            alt="User profile"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div> */}

<div className="aspect-square h-[70px] relative overflow-hidden rounded-full bg-gray-200">
  <Image
    src={user2.avatar_url || "/images/default-avatar.jpg"} // Ensure the path is correct
    alt="User profile"
    layout="fill"
    objectFit="cover"
    className="rounded-full" // Changed from rounded-md to rounded-full
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>



      <div className="flex-1 flex flex-col justify-center p-2 truncate">

      <span onClick={ () => router.push(`/profile?id=${user2.id}`)} className="text-sm mt-1 text-neutral-500 hover:text-neutral-400 hover:underline">{user2.username}</span>

        <p className="text-neutral-400 text-base truncate">
           {/* { lastMessage?.messages_files != undefined && lastMessage.messages_files.length > 0 && "You : " + lastMessage.messages_files[lastMessage.messages_files.length - 1].file_name } */}
          {lastMessage?.sender_id === user?.id && "You :"}   {lastMessage?.content}
        </p>

      </div>

      
    </div>
  );
};

export default ConversationItem;
