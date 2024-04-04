
import getUserProfileInfo from '@/actions/getUserProfileInfo'
import React from 'react'
import AccountContent from './components/AccountContent'
import useProfileSetupModal from '@/hooks/useProfileSetupModal'

export const revalidate = 0

const Account = async () => {

    const userProfileInfo  = await getUserProfileInfo()


  return (
    <div className='
    bg-neutral-900
    rounded-lg
    h-full
    w-full
    overflow-hidden
    overflow-y-auto
    '>
        {/* <Header>

            <div className='mt-20'>
                <div className='flex flex-col md:flex-row items-center gap-x-5'>
                        <div className='relative h-32 w-32 lg:h-44 lg:w-44'>
                                <Image 
                                    fill 
                                    src={'/images/liked.jpg'} 
                                    alt='playlist' 
                                    className='object-cover' 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                        </div>
                        <div className='flex flex-col gap-y-2 mt-4 md:mt-0'>
                            <p className='hidden md:block font-semibold text-sm'>
                                Account Settings
                            </p>
                            <h1 className='text-white text-4xl sm:text-5xl lg:text-7xl font-bold'>
                                Account
                            </h1>

                        </div>
                </div>
            </div>

        </Header> */}


        <AccountContent userProfileInfo={userProfileInfo} />

    </div>
  )

}

export default Account