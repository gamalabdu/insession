import getSongsByUserId from "@/actions/getSongsByUserId";
import { getAllConversations } from "@/actions/messages";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {


  const userSongs = await getSongsByUserId();


  const { results: conversations } = await getAllConversations();
  

  return (
    <Sidebar songs={userSongs} conversations={conversations}>
      {children}
    </Sidebar>
  );
}
