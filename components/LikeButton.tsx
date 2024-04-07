"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { createClient } from "@/utils/supabase/client";

interface LikeButtonProps {
  songId: string;
  userId?: string
};

const LikeButton = (props: LikeButtonProps) => {

  const { songId } = props

  const router = useRouter();

  // const { supabaseClient } = useSessionContext();

  const supabaseClient = createClient()

  const { user } = useUser();

  console.log(user)

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
  
    const fetchData = async () => {

      const { data, error } = await supabaseClient
    .from('liked_songs')
    .select('*')
    .eq('user_id', user?.id)
    .eq('song_id', songId);

  if (error) {
    console.error("Error fetching liked song:", error.message);
    setIsLiked(false); // Handle the error state as appropriate
    return;
  }

  setIsLiked(data.length > 0);

    }

    fetchData();

  }, [songId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {

    if (isLiked) {

      const { error } = await supabaseClient
        .from('liked_songs')
        .delete()
        .eq('user_id', user?.id)
        .eq('song_id', songId)

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient
        .from('liked_songs')
        .insert({
          song_id: songId,
          user_id: user?.id
        })

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success('Success');
      }
    }

    router.refresh();
  }



  

   useEffect(() => {

    router.refresh()


   }, [isLiked])

  return (
    <button 
      className="
        cursor-pointer 
        hover:opacity-75 
        transition
      "
      onClick={handleLike}
    >
      <Icon color={isLiked ? '#22c55e' : 'white'} size={25} />
    </button>
  );
}

export default LikeButton;