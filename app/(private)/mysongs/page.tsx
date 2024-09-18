
import Header from "@/components/ui/Header";
import Image from "next/image";
import React from "react";
import LikedArtistContent from "./components/LikedArtistContent";
import getSongsByUserId from "@/actions/getSongsByUserId";
import MySongsContent from "./components/LikedArtistContent";

export const revalidate = 0;

const MySongs = async () => {


  const songs = await getSongsByUserId()


  return (
    <div
      className="
    bg-neutral-900
    rounded-lg
    h-full
    w-full
    overflow-hidden
    overflow-y-auto
    "
    >
      <Header>
        <div className="mt-20">
          <div className="flex flex-col md:flex-row items-center gap-x-5">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                fill
                src={"/images/liked.jpg"}
                alt="playlist"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">Playlist</p>
              <h1 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                My Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>

      <div className="mt-2 mb-7 px-6">
        
        {/* <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            {userProfileInfo.username}'s Shop
          </h1>
        </div> */}

        <MySongsContent songs={songs} />

      </div>

 

    </div>
  );
};

export default MySongs
