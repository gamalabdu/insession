import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import Player from "@/components/Player";
import Header from "@/components/ui/Header";
import { createClient } from "@/utils/supabase/server";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Listen to music!",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <UserProvider>
          <ModalProvider />
          {/* <Header user={user}>Home!</Header> */}
          {children}
          <Player />
        </UserProvider>
      </body>
    </html>
  );
}
