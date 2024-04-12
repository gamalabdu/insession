"use client";

import { Song } from "@/types";
import React, { useEffect, useState } from "react";
import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";

import WavesurferPlayer from "@wavesurfer/react";
import WaveSurfer from "wavesurfer.js";

interface PlayerContentProps {
  song: Song;
}

const PlayerContent = (props: PlayerContentProps) => {

  const { song } = props;

  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;

  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const player = usePlayer();


  const onPlayNext = () => {

    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }

    player.setId(nextSong);
  }






  const onPlayPrevious = () => {

    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);

    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) {
      // if we click previous on the first song of the playlist, it will play the last song on the playlist
      return player.setId(player.ids[player.ids.length - 1]);
    }

    player.setId(previousSong);
  }






  useEffect(() => {

    if (wavesurfer && song) {

      if (isPlaying) {

        wavesurfer.play()

      }

    }
  }, [ song, wavesurfer, isPlaying])



  useEffect(() => {

    if (wavesurfer) {
      wavesurfer.setVolume(volume);
    }
  }, [volume, wavesurfer])




  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }



  const onReady = (ws: WaveSurfer) => {

    setWavesurfer(ws);

    ws.on("finish", () => {

      onPlayNext();

    })

    if (!isPlaying) {

      ws.play()

    }

  }




const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
      setIsPlaying(!isPlaying);
    }
  };






  return (
    // <div className='grid grid-cols-2 md:grid-cols-3 h-full' >

    <div className="grid grid-cols-2 md:grid-cols-4 h-full ">

      <div className="flex w-full justify-start">

        <div className="flex items-center gap-x-4">
          <MediaItem song={song} isInLibrary={true} />
          <LikeButton songId={song.id} />
        </div>

      </div>

      <div
        className="
            flex
            md:hidden
            col-auto
            w-full
            justify-end
            items-center
        "
      >
        <div
          className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                p-1
                cursor-pointer
            "
          onClick={onPlayPause}
        >
          <Icon className="text-black" size={30} />
        </div>
      </div>

      <div className="hidden h-full md:flex items-center align-middle w-full">

          <div className="items-center align-middle w-full">
            <WavesurferPlayer
                height={50}
                waveColor="#b7c0c4"
                url={song.song_path}
                onReady={onReady}
                normalize={true}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                fillParent={true}
            />
          </div>

      </div>

      <div
        className="
            hidden
            h-full 
            md:flex
            justify-center
            items-center
            w-full
            max-w-[722px]
            gap-x-6
        "
      >
        <AiFillStepBackward
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
          onClick={onPlayPrevious}
        />

        <div
          onClick={onPlayPause}
          className="
                    flex
                    items-center
                    justify-center
                    h-10
                    w-10
                    rounded-full
                    bg-white
                    p-1
                    cursor-pointer
                "
        >
          <Icon size={30} className="text-black" />
        </div>

        <AiFillStepForward
          size={30}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
          onClick={onPlayNext}
        />
      </div>

      <div className="hidden md:flex w-full justify-end pr-2">
        <div className="flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            onClick={toggleMute}
            className="cursor-pointer"
            size={34}
          />

          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
