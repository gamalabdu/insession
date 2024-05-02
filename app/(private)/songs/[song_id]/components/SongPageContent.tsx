"use client";
import getUserProfileInfo from "@/actions/getUserProfileInfo";
import Input from "@/components/Input";
import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsFillSendFill } from "react-icons/bs";
import { FaRegMessage } from "react-icons/fa6";
import { GrSend } from "react-icons/gr";

interface SongPageContentProps {
  song: Song;
  userProfileInfo: Profile;
}

type Comment = {
  song_id: string;
  content: string;
  user_id: string;
  comment_id: string;
  owner: Profile;
  created_at: string;
};

const SongPageContent = (props: SongPageContentProps) => {
  const { song, userProfileInfo } = props;

  const [comment, setComment] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [comments, setComments] = useState<Comment[]>([]);

  const postComment = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data: commentData, error: commentError } = await supabase
      .from("comments")
      .insert({
        content: comment,
        user_id: userProfileInfo.id,
        song_id: song.id,
      });

    if (commentError) {
      toast.error(commentError.message);
    }

    setIsLoading(false);
    setComment("");
    toast.success("Comment posted!");
  };

  const onPlay = useOnPlay(song);

  function timeAgo(created_at: string): string {
    // Get the current date and the date from the ISO string
    const currentDate = new Date();
    const pastDate = new Date(created_at);

    // Calculate the difference in milliseconds
    const difference = currentDate.getTime() - pastDate.getTime();

    // Convert the difference from milliseconds to hours
    const hours = difference / (1000 * 60 * 60);

    // Check if the difference is more than 24 hours to use days, otherwise use hours
    if (hours >= 24) {
      // Calculate days and round down
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      // Round down the hours for simplicity
      const roundedHours = Math.floor(hours);
      return `${roundedHours} hour${roundedHours !== 1 ? "s" : ""} ago`;
    }
  }

  useEffect(() => {
    const supabase = createClient();

    const fetchComments = async () => {
      const { data: comments, error: fetchedCommentsError } = await supabase
        .from("comments")
        .select("*, owner:profiles(*)")
        .eq("song_id", song.id)
        .order("created_at", { ascending: false })
        .returns<Comment[]>();

      if (fetchedCommentsError) {
        toast.error(fetchedCommentsError.message);
      }

      setComments(comments as Comment[]);
    };

    fetchComments();

    supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments" },
        async (payload) => {
          console.log(payload);
          const comment = payload.new as Comment;
          setComments((prev) => [...prev, comment]);
        }
      );
  }, [song.id, comments]);

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

      <div className="w-full p-4">
        <div className="flex items-center align-middle gap-5">
          <div className="aspect-square h-[40px] relative rounded-full bg-gray-200">
            <Image
              src={userProfileInfo.avatar_url}
              alt="User profile"
              fill
              objectFit="cover"
              className="rounded-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <Input
            placeholder="What do you think?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            type="submit"
            onClick={() => postComment()}
            className="flex items-center justify-center bg-orange-700 hover:bg-orange-900 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size="sm" color="white" />
            ) : (
              <GrSend size={20} />
            )}
          </button>
        </div>

        <div className="text-neutral-500 flex items-center align-middle gap-3 mt-10">
          {" "}
          {comments.length.toString()} Comments <FaRegMessage />{" "}
        </div>

        <hr className="border-neutral-500" />

        <div className="flex flex-col gap-3 p-4">
          {comments.length > 0 && (
            <div className="flex flex-col gap-4">
              {comments.map((comment, idx) => {
                const timeAgoString = timeAgo(comment.created_at);

                return (
                  <div
                    key={idx}
                    className="flex items-center align-middle gap-5 p-2 rounded-md bg-neutral-800"
                  >
                    <div className="aspect-square h-[40px] relative rounded-full bg-gray-200">
                      <Image
                        src={comment.owner.avatar_url}
                        alt="User profile"
                        fill
                        objectFit="cover"
                        className="rounded-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="text-neutral-400">{comment.content}</div>
                    <div className="text-sm text-neutral-600">
                      {timeAgoString}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongPageContent;
