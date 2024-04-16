"use client";
import React, { useState } from "react";
import FilesModal from "@/components/FilesModal";

interface ClientFileModalHandlerProps {
    conversation_id: string
}

const ClientModalHandler = (props: ClientFileModalHandlerProps) => {

const { conversation_id } = props

  const [filesModalOpen, setFilesModalOpen] = useState(false);

  const toggleModal = () => setFilesModalOpen(!filesModalOpen);

  return (
    <div className="flex flex-col justify-between h-full pb-2">
      <div
        className="border rounded-full py-2 px-4 mt-auto hover:bg-neutral-700 cursor-pointer"
        onClick={toggleModal}
      >
        Files 
      </div>

      <FilesModal
        filesModalOpen={filesModalOpen}
        setFilesModalOpen={setFilesModalOpen}
        conversation_id ={conversation_id}
      />

    </div>
  );
};

export default ClientModalHandler;
