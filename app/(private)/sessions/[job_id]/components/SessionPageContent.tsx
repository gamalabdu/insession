"use client";
import React from "react";
import { Job, Profile } from "@/types";
import { LuFileAudio } from "react-icons/lu";
import qs from "query-string";
import Button from "@/components/Button";
import Header from "@/components/ui/Header";
import Image from "next/image";
import useBidModal from "@/hooks/useBidModal";
import { useRouter } from "next/navigation";

interface SessionPageContentProps {
  job: Job;
  userProfileInfo: Profile;
}

const SessionPageContent = (props: SessionPageContentProps) => {
  const { job, userProfileInfo } = props;

  const bidModal = useBidModal();

  const router = useRouter();

  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[^\/\n\s]+)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = job.reference_link ? extractVideoId(job.reference_link) : "";

  const handleClick = () => {
    const query = {
      id: job.user_id,
    };

    const url = qs.stringifyUrl({
      url: `/profile`,
      query: query,
    });

    router.push(url);
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44 aspect-square">
              <Image
                fill
                src={userProfileInfo.avatar_url || "/images/liked.jpg"}
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">
                Posted by :
                <span
                  className=" hover:underline cursor-pointer"
                  onClick={() => handleClick()}
                >
                  {" " + job.created_by}
                </span>
              </p>

              <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-bold">
                {job.job_title}
              </h1>

              <Button onClick={bidModal.onOpen}>Bid for Session</Button>
            </div>
          </div>
        </div>
      </Header>

      <div className="flex flex-col gap-y-5 px-6 max-w-screen-xl">
        <div className="text-lg text-neutral-400">Job Information</div>

        <div className="text-lg text-neutral-400">
          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold"> Title : </span>
            <span> {job.job_title} </span>
          </div>

          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold"> Description : </span>
            <span> {job.job_description} </span>
          </div>

          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold">
              {" "}
              Additional Info :{" "}
            </span>
            <span> {job.additional_info} </span>
          </div>

          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold"> Budget : </span>
            <span> {job.budget} </span>
          </div>

          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold"> Genres(s) : </span>
            <span> {job.genre} </span>
          </div>

          <div className="flex gap-1">
            <span className="text-neutral-300 font-bold"> Posted By : </span>
            <span
              className=" hover:underline cursor-pointer"
              onClick={() => handleClick()}
            >
              {" "}
              {job.created_by}{" "}
            </span>
          </div>
        </div>

        <hr className="border-neutral-600 border-1" />

        <div className="text-neutral-400 text-2xl flex flex-col gap-y-4 h-full">
          <span className="text-lg text-neutral-400">
            References / Demos / Drafts
          </span>

          <div className="p-3 flex gap-4 h-auto flex-col gap-y-5">
            {job.reference_files &&
              job.reference_files.map((preview, index) => (
                <div className="text-lg flex items-center gap-4" key={index}>
                  <LuFileAudio />
                  <span>{preview.name}</span>
                  <audio controls src={preview.url}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}

            {videoId && (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                  className="w-full h-full"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPageContent;
