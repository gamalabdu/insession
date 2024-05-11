"use client"
import JobItem from '@/components/JobItem'
import { useUser } from '@/hooks/useUser'
import { Job } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { Skeleton } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const MessagesSessionsContent = () => {

  const supabase = createClient()

  const [sessions, setSessions ] = useState<Job[]>()
  const [ loading, setLoading ] = useState(false)

  const { user } = useUser()

  useEffect(() => {

    setLoading(true)

    const fetchPrivateSessions = async () => {
      
          const { data: privateSessions, error: privateSessionsError } = await supabase
          .from("jobs")
          .select("* , genres(name)")
          .eq("receiver_id", user?.id)
          .eq("job_type", "private")
          .returns<Job[]>()

          if (privateSessionsError) {
            toast.error(privateSessionsError.message)
          }
          setLoading(false)
          setSessions(privateSessions as Job[])
    }



    fetchPrivateSessions()
    
  }, [])


  if ( sessions?.length === 0 ) {
    return <span className='p-4'> You've got no sessions. </span>
  }

  if ( loading ) {
    return (
      <div className="w-full flex items-center gap-3 mt-20">
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
    )
  }


  return (

    <div>
        
        {
          sessions?.map((session, idx) => {
            return (
              <div key={idx} className="flex items-center gap-x-4 w-full">
                <div className="flex-1 overflow-y-auto">
                  <JobItem job={session} isPrivate={true} />
                </div>
            </div>
            )
          })
        }

    </div>
  )
}

export default MessagesSessionsContent