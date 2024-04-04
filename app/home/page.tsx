import Header from '@/components/Header'
import { SessionContextProvider, useUser } from '@supabase/auth-helpers-react'
import React from 'react'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Sidebar from '@/components/Sidebar';
import getSongsByUserId from '@/actions/getSongsByUserId';


export const revalidate = 0


const Home = () => {


  return (
    <div className=''>



          <Header>
          Home!
          </Header>

    </div>
  )
}

export default Home