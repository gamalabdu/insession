"use client";
import { Song } from "@/types";
import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/ui/Header";
import PageContent from "../../dashboard/components/PageContent";
import { FiMessageSquare } from "react-icons/fi";
import MessageModal from "@/components/MessageModal";



interface ProfileContentProps {
  userProfileInfo: Profile;
  songs : Song[]
}

const ProfilePageContent = (props: ProfileContentProps) => {

  const { userProfileInfo, songs } = props;


  const [ messageModalOpen, setMessageModalOpen ] = useState(false)


  const sendMessage = async () => {

    setMessageModalOpen(true)

  };


  const testAlbums = [
    {
      name: "Thriller",
      artist: "Michael Jackson",
      artwork: "https://pbs.twimg.com/media/GAIeUD5W8AAn98v.jpg"
    },
    {
      name: "archives & lullabies",
      artist: "Sabrina Claudio",
      artwork: "https://e.snmc.io/i/600/s/e2b3c8f41c94b33aad0bc51676b99b2f/10696704/sabrina-claudio-archives-and-lullabies-Cover-Art.jpg"
    },
    {
      name:"Take Care",
      artist: "Drake",
      artwork: "https://m.media-amazon.com/images/I/71q3s6618yL._AC_UF894,1000_QL80_.jpg"
    },
    {
      name:"Continuum",
      artist: "John Mayer",
      artwork: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Continuum_by_John_Mayer_%282006%29.jpg"
    },
    {
      name:"To Pimp a Butterfly",
      artist: "Kendrick Lamar",
      artwork: "https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2015/3/11/1426099817173/f1efb3f4-9a6d-4f78-8ca8-594ab646d198-bestSizeAvailable.jpeg?width=620&quality=85&auto=format&fit=max&s=1bb96ed49608e22a3d9f6fefff086971"
    }
  ]




  



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
            <div className="relative h-40 w-40 lg:h-80 lg:w-80">
              <Image
                fill
                src={userProfileInfo.avatar_url || "/images/userIcon.png"}
                alt="playlist"
                className="object-cover rounded-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <span> Profile </span>
              <span className="w-fit bg-neutral-700 text-neutral-200 p-2 rounded-lg opacity-90"> Producer </span>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {userProfileInfo.username}
              </h1>
              <p className="hidden md:block font-semibold text-sm">
                {userProfileInfo.email}
              </p>
              <p className="hidden md:block font-semibold text-sm text-neutral-400">
                Genres: {userProfileInfo.genres.map((genre) => genre).join(" / ")}
              </p>

              <button onClick={sendMessage} className="border w-fit rounded-md p-2 hover:scale-[1.05] transition-all">
                {/* <FiMessageSquare /> */}
                Message
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

        {/* <div className="flex border">

          {
            testAlbums.map((album, index) => {
              return (
                <div key={index} className=" w-[100px] border lg:w-[300px]">
                  <img src={album.artwork} alt={album.artist} />
                </div>
              )
            })
          }


        </div>  */}


        <PageContent songs={songs} heroImage={userProfileInfo.avatar_url} />


        <MessageModal messageModalOpen={messageModalOpen} setMessageModalOpen={setMessageModalOpen} userProfileInfo={userProfileInfo}  />




      </div>

    </div>

  )

}

export default ProfilePageContent;
