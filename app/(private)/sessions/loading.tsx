import { Skeleton } from '@nextui-org/react'
import React from 'react'

const loading = () => {
  return (
    <div className="flex flex-col gap-4 px-6 w-full">
    <div className="w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
    <div className=" w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
    <div className="w-full flex items-center gap-3"> 
      <div>
        <Skeleton className="flex rounded-full w-[70px] h-[70px]" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  </div>
  )
}

export default loading