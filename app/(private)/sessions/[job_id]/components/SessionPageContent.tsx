"use client";
import React, { useEffect, useState } from "react";
import { Bid, Job } from "@/types";
import { LuFileAudio } from "react-icons/lu";
import qs from "query-string";
import Button from "@/components/Button";
import Header from "@/components/ui/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SessionInfoContent from "./SessionInfoContent";
import { useUser } from "@/hooks/useUser";
import Proposals from "./Proposals";
import deleteSessionBySessionId from "@/actions/deleteSessionBySessionId";
import DeleteSessionModal from "./DeleteSessionModal";
import BidModal from "@/components/modals/BidModal";

interface SessionPageContentProps {
  job: Job;
  userProfileInfo: Profile;
  proposals: Bid[] | null
}

const SessionPageContent = (props: SessionPageContentProps) => {

  const { job, userProfileInfo, proposals } = props;

  const router = useRouter();


  const [ tab, setTab ] = useState<"info" | "proposals">("info")

  const [ bidModalOpen, setBidModalOpen ] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen ] = useState(false)

  const { user, isLoading } = useUser()

  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[^\/\n\s]+)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = job.reference_link ? extractVideoId(job.reference_link) : "";

  const isCurrentUser = job.user_id === user?.id


  useEffect(() => {
    if (!isLoading) {  // Ensure the loading is complete
      if (job.receiver_id !== user?.id) {
        router.push('/sessions');
      }
    }
  }, [isLoading, user, job.receiver_id, router]);


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
                src={userProfileInfo.avatar_url || "/images/userIcon.png"}
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

              { !isCurrentUser && job.job_type === "public" && (
                <Button onClick={() => setBidModalOpen(true)}>
                  Bid for Session
                </Button>
              )}

              { isCurrentUser && job.job_type === "private" && (
                <Button onClick={ () => setDeleteModalOpen(true) }>
                  Delete Session
                </Button>
              )}



            </div>
            
          </div>

          

        </div>

        
      </Header>

    {
      isCurrentUser && 

      <div className="flex items-center justify-center gap-24 text-neutral-400 p-2">
        <div
          className={
            tab === "info"
              ? " text-neutral-100 cursor-pointer"
              : "cursor-pointer"
          }
          onClick={() => setTab("info")}
        >
          {" "}
          Information{" "}
        </div>

        <div
          className={
            tab === "proposals"
              ? " text-neutral-100 cursor-pointer"
              : "cursor-pointer"
          }
          onClick={() => setTab("proposals")}
        >
          {" "}
          Proposals{" "}
        </div>
      </div>

    }

      {
        tab === 'info' ? 

        <SessionInfoContent
        job={job}
        videoId={videoId}
        handleClick={handleClick}
        isCurrentUser={isCurrentUser}
      />

      : 


        <Proposals job={job} proposals={proposals} userProfileInfo={userProfileInfo} />


      }


      <BidModal
        bidModalOpen={bidModalOpen}
        setBidModalOpen={setBidModalOpen}
        job={job}
        user_id={userProfileInfo.id}
      />

     <DeleteSessionModal jobId={job?.job_id} userId={user?.id || ""} deleteModalOpen={deleteModalOpen} onClose={setDeleteModalOpen} />


    </div>
  );
};

export default SessionPageContent;
