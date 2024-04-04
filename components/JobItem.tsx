"use client"
import getUserProfileById from '@/actions/getUserProfileById'
import useGetUserProfileInfo from '@/hooks/useGetUserProfileInfo'
import useLoadImage from '@/hooks/useLoadImage'
import useLoadProfileImage from '@/hooks/useLoadProfileImage'
import { useUser } from '@/hooks/useUser'
import { Job, Song } from '@/types'
import Image from 'next/image'
import React from 'react'


interface JobItemProps {
    job: Job
}

const JobItem = (props : JobItemProps) => {

    const { job } = props

    const { userProfileInfo } = useGetUserProfileInfo(job.user_id)


    const imageUrl = useLoadProfileImage(userProfileInfo ?? null);




  return (


<div className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md">

  {/* Separate container for image and text for clarity */}

  <div className="flex flex-col items-center">

    <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden">

      <Image
        priority
        fill
        src={imageUrl || "/images/liked.jpg"}
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

    <p className='text-neutral-300 text-sm truncate'> Genre: {job.genre} </p>

  </div>

</div>
  );
}

export default JobItem





//     <div
//       className="
//     flex
//     items-center
//     gap-x-3
//     cursor-pointer
//     hover:bg-neutral-800/50
//     w-full
//     p-2
//     rounded-md
//     "
//     >
//       <div className="relative rounded-md min-h-[100px] min-w-[100px] overflow-hidden flex flex-col items-center">



// {/* 
//         <Image
//           fill
//           src={imageUrl || "/images/liked.jpg"}
//           alt="media-item"
//           className="object-cover"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         />

//         <p className="text-neutral-200 text-md truncate">
//           {job.created_by}
//         </p> */}

// <div className="w-full h-full">
//       <Image
//         fill
//         src={imageUrl || "/images/liked.jpg"}
//         alt="media-item"
//         className="object-cover"
//         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//       />
//     </div>

//     <p className="text-neutral-200 text-md mt-2 truncate w-full text-center">
//       {job.created_by}
//     </p>





//       </div>



//       <div
//         className="
//             flex
//             flex-col
//             gap-y-1
//             overflow-hidden
//         "
//       >
//         <p className="text-white truncate">{job.job_title}</p>

//         <p className="text-neutral-400 text-sm truncate">
//           {job.job_description}
//         </p>
//       </div>
//     </div>