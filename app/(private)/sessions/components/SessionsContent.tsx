"use client";
import JobItem from "@/components/JobItem";
import { Job } from "@/types";
import React from "react";
import Image from "next/image";
import Button from "@/components/Button";
import Header from "@/components/ui/Header";
import usePostSessionModal from "@/hooks/usePostSessionModal";

interface SessionsContentProps {
  allOtherJobs: Job[];
  allUserJobs?: Job[];
}

const SessionsContent = (props: SessionsContentProps) => {
  
  const { allOtherJobs, allUserJobs } = props;

  const postSessionModal = usePostSessionModal();


  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                priority
                layout="fill"
                src="https://picsum.photos/200/300"
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">

              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                Sessions
              </h1>

              <p className="hidden md:block font-semibold text-sm p-2">
                These are potential sessions waiting for you!
              </p>

              <Button onClick={postSessionModal.onOpen}>Post a Session</Button>
              
            </div>
          </div>
        </div>
      </Header>

      <div className="flex flex-col gap-y-2 w-full p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Your Posted Sessions :
          </h1>
        </div>

        {allUserJobs?.length === 0 ? (
          <div className="flex items-center gap-x-4 w-full">
            <div className="flex-1">You havent't posted any jobs yet.</div>
          </div>
        ) : (
          allUserJobs?.map((job) => (
            <div className="flex items-center gap-x-4 w-full" key={job.job_id} >
              <div className="flex-1">
                <JobItem job={job} />
              </div>
            </div>
          ))
        )}

        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            All Posted Sessions :
          </h1>
        </div>

        {allOtherJobs?.length === 0 ? (
          <div className="flex items-center gap-x-4 w-full">
            <div className="flex-1">There are no posted jobs.</div>
          </div>
        ) : (
          allOtherJobs?.map((job) => (
            <div className="flex items-center gap-x-4 w-full" key={job.job_id} >
              <div className="flex-1">
                <JobItem job={job} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionsContent;
