
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


