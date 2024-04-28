import { Job } from '@/types'
import React from 'react'
import { LuFileAudio } from 'react-icons/lu'


interface SessionInfoContentProps {
    job: Job
    videoId: string | null
    handleClick: () => void
    isCurrentUser: boolean
}

const SessionInfoContent = (props : SessionInfoContentProps) => {

    const { job, videoId, handleClick, isCurrentUser } = props


  return (

    <div className="flex flex-col gap-y-5 px-6 max-w-screen-xl">

{ !isCurrentUser && <div className="text-lg text-neutral-400">Job Information</div> }

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
        <span> Genre Type Here </span>
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

  )

}

export default SessionInfoContent