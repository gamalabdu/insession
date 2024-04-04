"use client";
import useLoadProfileImage from "@/hooks/useLoadProfileImage";
import { Profile, Song } from "@/types";
import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import PageContent from "@/app/dashboard/components/PageContent";
import useGetSongsByUserId from "@/hooks/useGetSongsByUserId";
import { FiMessageSquare } from "react-icons/fi";
import useMessageModal from "@/hooks/useMessageModal";
import { useUser } from "@/hooks/useUser";
import { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

interface ProfileContentProps {
  userProfileInfo: Profile
}

const ProfilePageContent = (props: ProfileContentProps) => {

  const { userProfileInfo } = props;

  const { user } = useUser()
  
  const supabaseClient = useSupabaseClient()

  console.log(" You clicked on " + userProfileInfo?.id)

  console.log( " This is who you are : " + user?.id)

  const songs = useGetSongsByUserId(userProfileInfo?.id).songs

  const router = useRouter()

  let safeSongs : Song[] = []

  if (songs) {
    safeSongs = songs
  }

  const messageModal = useMessageModal()

  const sendMessage = async () => {

    messageModal.setOtherId(userProfileInfo.id)

    messageModal.setOtherUserName(userProfileInfo.username)


    const { data: conversationData, error } = await supabaseClient
    .from('conversations')
    .select('conversation_id')
    .contains('participant_ids', JSON.stringify([user?.id, userProfileInfo.id ]))
    
    if (conversationData && conversationData.length > 0 ) {

      const conversationId = conversationData[0].conversation_id;

      router.push(`/messages/${conversationId}`);
      
    } else {

      return messageModal.onOpen()

    }

  }

  const displayClassName = `
  flex
                    w-full
                    rounded-md
                    bg-neutral-700
                    border
                    border-transparent
                    px-3
                    py-3
                    text-sm
                    file:border-0
                    file:bg-transparent
                    file:text-sm
                    file:font-medium
                    placeholder:text-neutral-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    focus:outline-none
  `;


  return (
    
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">

      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src={userProfileInfo.avatar_url || "/images/liked.jpg"}
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                 {userProfileInfo.username}
              </h1>
              <p className="hidden md:block font-semibold text-sm">
                {userProfileInfo.email}
              </p>
              <p className="hidden md:block font-semibold text-sm text-neutral-400">
                Rnb Hip Hop
              </p>

              <button onClick={sendMessage}>
                <FiMessageSquare />
              </button>



            </div>
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">

          <div className="flex justify-between items-center">
            
              <h1 className="text-white text-2xl font-semibold"> 
                {userProfileInfo.username}'s Shop
              </h1>

          </div>

          <PageContent songs={safeSongs} heroImage={userProfileInfo.avatar_url} />

      </div>
       

    </div>
  )

}

export default ProfilePageContent;
