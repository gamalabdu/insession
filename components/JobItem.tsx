"use client"
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import { Job } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Button from './Button'
import MessageModal from './MessageModal'


interface JobItemProps {
    job: Job
    isPrivate?: boolean
    className?: string
}

const JobItem = (props : JobItemProps) => {

    const { job, isPrivate, className } = props

    const { userProfileInfo } = useGetUserProfileInfo(job.user_id)

    const [ messageModalOpen, setMessageModalOpen ] = useState(false)

    const router = useRouter()

    const handleClick = (job_id: string) => {

      router.push(`/sessions/${job_id}`); 
  
    }

    const replyMessage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

      event.stopPropagation();
      setMessageModalOpen(true)

    }


  return (


<div className="flex flex-col lg:flex-row items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md justify-between overflow-auto"
  onClick={ () => handleClick(job.job_id) }
>


  <div className='flex items-center gap-x-3'>

      <div className="flex flex-col items-center">

        <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden">

          <Image
            priority
            fill
            src={userProfileInfo?.avatar_url || "/images/userIcon.png"}
            alt="media-item"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

        </div>

        <p className="text-neutral-200 text-md mt-2 truncate w-full text-center">
          {job.created_by}
        </p>

      </div>

      <div className="flex flex-col gap-y-1 overflow-hidden">

        <p className="text-white truncate">{job.job_title}</p>

        <p className="text-neutral-400 text-md truncate">{job.job_description}</p>

        <p className="text-neutral-400 text-xs truncate">{job.additional_info}</p>

        <p className='text-neutral-300 text-sm truncate'> Budget: {job.budget}$ </p>

        {job.genres.length > 0 && (
                <p className='text-neutral-300 text-sm truncate'> Genre(s) :  
                  {" "} {job.genres.map((genre) => genre.name).join(' / ')}
                </p> 
        )}


      </div>


  </div>


  <div className="flex gap-5 w-fit">
  {/* xl:w-[150px] */}
    {isPrivate && <Button onClick={(e) => replyMessage(e)} className='w-full'>Reply</Button>}
    {isPrivate && <Button className='w-full'>Accept</Button>}
  </div>


  { userProfileInfo &&  <MessageModal messageModalOpen={messageModalOpen} setMessageModalOpen={setMessageModalOpen} userProfileInfo={ userProfileInfo } /> } 


</div>
  );
}

export default JobItem



