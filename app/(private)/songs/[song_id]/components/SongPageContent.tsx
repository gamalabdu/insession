"use client";
import LikeButton from "@/components/LikeButton";
import SongItem from "@/components/SongItem";
import { Song } from "@/types";
import React from "react";

interface SongPageContentProps {
  song: Song;
}

const SongPageContent = (props: SongPageContentProps) => {
  
  const { song } = props;

  return (


          <SongItem song={song} onClick={() => {}} />


  );
};

export default SongPageContent;
