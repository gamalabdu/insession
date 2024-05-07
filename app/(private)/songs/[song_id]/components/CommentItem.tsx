import { Song } from '@/types'
import Image from 'next/image'
import Link from 'next/link';
import React, { Fragment } from 'react'


type Comment = {
    song_id: string;
    content: string;
    user_id: string;
    comment_id: string;
    owner: Profile;
    created_at: string;
};

interface CommentItemProps {
    comment: Comment
    timeAgo: string
    key: number
}
const CommentItem = (props: CommentItemProps) => {

    const { comment, timeAgo } = props

  return (

    <div className="flex items-center align-middle gap-5 p-2 rounded-md bg-neutral-800">


      <div className="aspect-square h-[40px] relative rounded-full bg-gray-200">

      <Image
        src={comment.owner.avatar_url}
        alt="User profile"
        fill
        className="rounded-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
     
      </div>

    <div className='flex flex-col'>

        <Link href={`/profile?id=${comment.owner.id}`}>
           <div className="text-neutral-300 text-sm hover:text-neutral-400 cursor-pointer">{comment.owner.username}</div>
        </Link>

        <div className="text-neutral-400">{comment.content}</div>

    </div>

 

    <div className="text-sm text-neutral-600">
      {timeAgo}
    </div>


  </div>



  )
}

export default CommentItem