import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/main";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import Player from "@/components/Player";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InSession",
  description: "connect with producers and artist!",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <Providers>
          <ModalProvider />
          {/* <Header user={user}>Home!</Header> */}
          {children}
          <Player />
        </Providers>
      </body>
    </html>
  );
}
