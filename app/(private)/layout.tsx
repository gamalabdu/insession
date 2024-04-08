import getSongsByUserId from "@/actions/getSongsByUserId";
import Sidebar from "@/components/Sidebar";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userSongs = await getSongsByUserId();

  return <Sidebar songs={userSongs}>{children}</Sidebar>;
}
