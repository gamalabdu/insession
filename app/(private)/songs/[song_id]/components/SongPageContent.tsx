"use client";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import React from "react";

interface SongPageContentProps {
  song: Song;
}

const SongPageContent = (props: SongPageContentProps) => {
  
  const { song } = props;


  const onPlay = useOnPlay(song)

  return (

    <div
      className="
      flex
      flex-col
      gap-y-2
      w-full
      px-6
    "
    >

    <div key={song.id} className="flex items-center gap-x-4 w-full">
    <div className="flex-1">
      <MediaItem onClick={(id: string) => onPlay(id)} song={song} />
    </div>

    <LikeButton songId={song.id} />
  </div>

  </div>


  )
}

export default SongPageContent;
