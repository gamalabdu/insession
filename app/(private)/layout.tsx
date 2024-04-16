import getSongsByUserId from "@/actions/getSongsByUserId";
import Sidebar from "@/components/Sidebar";
import ConversationsProvider from "@/providers/conversations";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userSongs = await getSongsByUserId();
  return (
    <ConversationsProvider>
      <Sidebar songs={userSongs}>{children}</Sidebar>
    </ConversationsProvider>
  );
}
