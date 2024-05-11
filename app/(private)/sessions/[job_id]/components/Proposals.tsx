"use client"
import Button from '@/components/Button'
import MessageModal from '@/components/MessageModal'
import { Bid, Job } from '@/types'
import Image from 'next/image'
import { useState } from 'react'



interface ProposalsProps {
    job: Job
    proposals: Bid[] | null
    userProfileInfo : Profile
}

const Proposals = (props : ProposalsProps) => {

    const { proposals } = props 

    const [ messageModalOpen, setMessageModalOpen ] = useState(false)


    const handleClick = () => {

      setMessageModalOpen(true)

    }


  return (

    <div
      className="
      flex
      flex-col
      gap-y-2
      w-full
      px-6
    "
    >

       {
        proposals?.map((proposal, idx) => (
            <div
            // onClick={handleClick}
            key={idx}
            className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md justify-between"
          >

           
           <div className='flex items-center gap-x-3'>

            <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
              <Image
                fill
                src={proposal.owner.avatar_url}
                alt="media-item"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
      
            {/* overflow-hidden */}
            <div
              className="
                  flex
                  flex-col
                  gap-y-1
               
              "
            >
              <p className="text-white">{proposal.title}</p>
      
              <div
                className="text-neutral-400 text-sm truncate"
              >
                {proposal.proposal}
      
              </div>
      
            </div>

            </div>


            <Button className='w-[100px]' 
            onClick={() => handleClick()}
            > Reply </Button>


             <MessageModal messageModalOpen={messageModalOpen} setMessageModalOpen={setMessageModalOpen} userProfileInfo={proposal.owner} />


      
          </div>


        ))
       }




    </div>

  )

}

export default Proposals