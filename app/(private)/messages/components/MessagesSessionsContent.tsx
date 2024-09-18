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

  const [sentSessions, setSentSessions ] = useState<Job[]>()
  const [receievedSessions, setRecievedSessions ] = useState<Job[]>()

  const [ loading, setLoading ] = useState(false)

  const [ tab, setTab ] = useState<"recieved" | "sent">("recieved")

  const { user } = useUser()

  useEffect(() => {

    setLoading(true)

    const fetchRecievedPrivateSessions = async () => {
      
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
          setRecievedSessions(privateSessions as Job[])
    }


    const fetchSentPrivateSessions = async () => {
      
      const { data: privateSessions, error: privateSessionsError } = await supabase
      .from("jobs")
      .select("* , genres(name)")
      .neq("receiver_id", user?.id)
      .eq("job_type", "private")
      .returns<Job[]>()

      if (privateSessionsError) {
        toast.error(privateSessionsError.message)
      }
      setLoading(false)
      setSentSessions(privateSessions as Job[])
}



    fetchRecievedPrivateSessions()
    fetchSentPrivateSessions()
    
  }, [])


  if ( sentSessions?.length === 0 && receievedSessions?.length === 0 ) {
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

          <div className="flex items-center justify-center gap-24 text-neutral-400">

              <div className={ tab === 'recieved' ? ' text-neutral-100 cursor-pointer' : 'cursor-pointer' } onClick={() => setTab("recieved")} > Recieved </div>

              <div className={ tab === 'sent' ? ' text-neutral-100 cursor-pointer' : 'cursor-pointer' } onClick={() => setTab("sent")} > Sent </div>

          </div>
        
        {
          tab === "recieved" ? 

          receievedSessions?.length === 0 ? 
              
              
              <span className='p-4'> You've got recieved sessions. </span>


          :

          receievedSessions?.map((session, idx) => {
            return (
              <div key={idx} className="flex items-center gap-x-4 w-full">
                <div className="flex-1 overflow-y-auto">
                  <JobItem job={session} isPrivate={true} />
                </div>
            </div>
            )
          })

          :

          sentSessions?.length === 0 ? 
              
              
              <span className='p-4'> You've got sent sessions. </span>


          :

          sentSessions?.map((session, idx) => {
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