"use client"
import Button from '@/components/Button'
import { Bid, Job } from '@/types'
import Image from 'next/image'



interface ProposalsProps {
    job: Job
    proposals: Bid[] | null
}

const Proposals = async (props : ProposalsProps) => {

    const { job, proposals } = props 


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
        proposals?.map((proposal) => (
            <div
            // onClick={handleClick}
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


            <Button className='w-[100px]'> Reply </Button>
      
          </div>
        ))
       }

    </div>

  )

}

export default Proposals