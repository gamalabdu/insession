"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { LuFileAudio } from "react-icons/lu";
import { PiFileZip } from "react-icons/pi";
import Link from "next/link";

interface FilesModalProps {
  filesModalOpen: boolean;
  setFilesModalOpen: Function;
  conversation_id: string;
}

type MessageFileData = {
  conversation_id: string;
  created_at: string;
  file_name: string;
  id: string;
  message_id: string;
  type: string;
  url: string;
};

const FilesModal = (props: FilesModalProps) => {
  const { filesModalOpen, setFilesModalOpen, conversation_id } = props;

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, userDetails } = useUser();
  const [imageFiles, setImageFiles] = useState<MessageFileData[]>([]);
  const [audioFiles, setAudioFiles] = useState<MessageFileData[]>([]);
  const [zipFiles, setZipFiles] = useState<MessageFileData[]>([]);

  const formattedDate = (created_at: string) => {
    const date = new Date(created_at);
    const formattedDate = date.toLocaleDateString("en-CA");
    return formattedDate;
  };

  const onChange = (open: boolean) => {
    if (!open) {
      setFilesModalOpen(false);
    }
  };

  useEffect(() => {
    const supabase = createClient();
    const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("messages_files")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching files:", error.message);
        setIsLoading(false);
        return;
      }

      const images: MessageFileData[] = [],
        audios: MessageFileData[] = [],
        zips: MessageFileData[] = [];

      data?.forEach((file) => {
        if (file.type.includes("image")) {
          images.push(file);
        } else if (file.type.includes("audio")) {
          audios.push(file);
        } else if (file.type.includes("zip")) {
          zips.push(file);
        }
      });

      setImageFiles(images);
      setAudioFiles(audios);
      setZipFiles(zips);
      setIsLoading(false);
    };

    fetchData();
  }, [conversation_id]);

  return (
    <Modal
      title="Your Session HardDrive"
      description=""
      isOpen={filesModalOpen}
      onChange={onChange}
    >
      <div>
        {imageFiles.length > 0 && (
          <div className="">
            <div className="pl-2">Image Files</div>
            <hr className="m-2" />
            <div
              className="grid 
              grid-cols-2 
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-4
              gap-4 
              p-3
              h-full
              max-h-[100px]
              overflow-auto"
            >
              {imageFiles.map((imageFile) => (
                <Link
                  href={`${imageFile.url}?download=${imageFile.file_name}`}
                  download={imageFile.file_name}
                  className="flex flex-col gap-1 justify-center align-middle items-center"
                  key={imageFile.id}
                >
                  <Image
                    className="rounded object-cover"
                    width={64}
                    height={64}
                    src={imageFile.url}
                    alt=""
                  />
                  <span className="flex text-xs overflow-hidden text-ellipsis truncate">
                    {imageFile.file_name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formattedDate(imageFile.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {audioFiles.length > 0 && (
          <div className="">
            <div className="pl-2">Audio Files</div>
            <hr className="m-2" />
            <div
              className="grid 
        grid-cols-2 
        sm:grid-cols-3
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-4
        gap-4 
        p-3
        h-full
        max-h-[100px]
        overflow-auto
        "
            >
              {audioFiles.map((audioFile) => (
                <Link
                  href={`${audioFile.url}?download=${audioFile.file_name}`}
                  download={audioFile.file_name}
                  className="flex flex-col gap-2 items-center align-middle justify-center"
                  key={audioFile.id}
                >
                  <div className="flex pt-4 pb-4 rounded-md bg-neutral-100 justify-center items-center w-[40px]">
                    <LuFileAudio size={20} className="text-neutral-500" />
                  </div>
                  <span className="flex w-full text-xs overflow-hidden text-ellipsis truncate">
                    {audioFile.file_name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formattedDate(audioFile.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {zipFiles.length > 0 && (
          <div className="">
            <div className="pl-2">Zip Files</div>
            <hr className="m-2" />
            <div
              className="grid 
              grid-cols-2 
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              2xl:grid-cols-8 
              gap-4 
              p-3
              h-full
              max-h-[100px]
              overflow-auto"
            >
              {zipFiles.map((zipFile) => (
                <Link
                  className="flex flex-col gap-2 items-center align-middle justify-center"
                  href={`${zipFile.url}?download=${zipFile.file_name}`}
                  download={zipFile.file_name}
                  key={zipFile.id}
                >
                  <div className="flex pt-4 pb-4 rounded-md bg-neutral-100 justify-center items-center w-[40px]">
                    <PiFileZip size={20} className="text-neutral-500" />
                  </div>
                  <span className="flex w-full text-xs overflow-hidden text-ellipsis truncate">
                    {zipFile.file_name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {formattedDate(zipFile.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FilesModal;
