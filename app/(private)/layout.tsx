import getAllConversations from "@/actions/getAllUserConversations";
import getSongsByUserId from "@/actions/getSongsByUserId";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {

  const userSongs = await getSongsByUserId();

  const conversations = await getAllConversations()

  return <Sidebar songs={userSongs} conversations={conversations}>{children}</Sidebar>;
}
