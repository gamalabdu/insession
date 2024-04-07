"use client";

import useProfileSetupModal from "@/hooks/useProfileSetupModal";
import { useEffect } from "react";

export default function ProfileSetup({ isEnabled }: { isEnabled: boolean }) {
  const { onOpen } = useProfileSetupModal();
  useEffect(() => {
    if (!isEnabled) {
      onOpen();
    }
  }, [isEnabled]);
  return <></>;
}
