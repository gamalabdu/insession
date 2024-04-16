"use client";

import { MyUserContextProvider } from "@/hooks/useUser";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    // <NextUIProvider>
    <MyUserContextProvider>{children}</MyUserContextProvider>
    // </NextUIProvider>
  );
};

export default UserProvider;
