
import getAllJobs from '@/actions/getAllJobs'
import getJobsByUserId from '@/actions/getAllJobsByUserId'
import React from 'react'
import SessionsContent from './components/SessionsContent'


export const revalidate = 0


const Sessions = async () => {

    const allOtherJobs = await getAllJobs()

    const allUserJobs = await getJobsByUserId()


  return (

        <SessionsContent 
           allUserJobs={allUserJobs} 
           allOtherJobs={allOtherJobs} 
           /> 

  )

}

export default Sessions





    {/* <div className="mt-2 mb-7 px-6">

        <div className="flex align-middle items-center">
      
        <h1 className="text-white text-2xl font-semibold w-full"> 
          Search for sessions : 
        </h1>

        <SearchInput baseRoute='/sessions' placeholder='Search by producer name, city, state or genre' />

         <div className='flex flex-row h-[50px] justify-center items-center align-middle bg-neutral-700 p-1 rounded-md'>
            <input className="bg-transparent pl-2 focus:outline-none text-sm w-full" placeholder='city or state' />
            <div className='border border-l-1 h-[20px] align-middle'/>
            <input className='bg-transparent pl-4 focus:outline-none text-sm w-full' placeholder='genre' />
        </div> 

        </div>


           <SessionsContent 
           allUserJobs={allUserJobs} 
           allOtherJobs={allOtherJobs} 
           /> 

    </div> */}