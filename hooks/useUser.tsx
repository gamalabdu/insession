"use client";

import { Profile } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type UserContextType = {
  user: User | null;
  userDetails: Profile | null;
  isLoading: {
    session: boolean;
    profile: boolean;
  };
  // subscription: Subscription | null,
};

export const UserContext = createContext<UserContextType>(null!);

export const MyUserContextProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [isLoading, setIsLoading] = useState({
    session: true,
    profile: true,
  });
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Profile | null>(null);


  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading((prev) => ({ ...prev, session: false }));
    });
    supabase.auth.onAuthStateChange((_, session) => {
      session && setUser(session.user);
    });
  }, []);


  useEffect(() => {
    if (!user) return setIsLoading((prev) => ({ ...prev, profile: false }));
    const supabase = createClient();
    (async () => {
      setIsLoading((prev) => ({ ...prev, profile: true }));
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      data && setUserDetails(data);
      setIsLoading((prev) => ({ ...prev, profile: false }));
    })();
  }, [user]);

  const value = {
    user,
    userDetails,
    isLoading,
    // subscription
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("The useUser must be used within a MyUserContextProvider");
  }

  return context;
};
