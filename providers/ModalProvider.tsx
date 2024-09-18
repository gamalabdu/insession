"use client";


import AuthModal from "@/components/modals/AuthModal";
import UploadModal from "@/components/modals/UploadModal";
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
      {/* <PostSessionModal /> */}
      {/* <BidModal /> */}
    </>
  );
};

export default ModalProvider;
