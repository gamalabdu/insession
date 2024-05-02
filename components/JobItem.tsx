"use client"
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import { Job } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'


interface JobItemProps {
    job: Job
}

const JobItem = (props : JobItemProps) => {

    const { job } = props

    // console.log(job)

    const { userProfileInfo } = useGetUserProfileInfo(job.user_id)

    const router = useRouter()

    const handleClick = (job_id: string) => {

      router.push(`/sessions/${job_id}`); 
  
    }


  return (


<div className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md" 
  onClick={ () => handleClick(job.job_id) }
>

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
  );
}

export default JobItem



