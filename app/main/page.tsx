"use client";

import Sidebar from "@/components/Sidebar";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import React, { Suspense, useEffect } from "react";
import Home from "../home/page";

interface MainProps {
  children: React.ReactNode;
  userSongs: Song[];
}

export const revalidate = 0;

const Main = (props: MainProps) => {

  const { userSongs, children } = props;

  const { user, isLoading } = useUser();


  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center align-middle text-center">
        ...Loading
      </div>
    );
  }

  return ( 
                user ? 

                <Sidebar songs={userSongs}>{children}</Sidebar> 

                : 
                
                <Home /> 
    )
};

export default Main;
