"use client";

import AuthModal from "@/components/AuthModal";
import MessageModal from "@/components/MessageModal";
import PostSessionModal from "@/components/PostSessionModal";
import UploadModal from "@/components/UploadModal";
import { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <UploadModal />
      <PostSessionModal />
      <MessageModal />
    </>
  );
};

export default ModalProvider;
