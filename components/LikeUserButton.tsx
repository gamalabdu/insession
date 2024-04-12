"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";


interface LikeButtonProps {
  artistId: string;
};

const LikeUserButton = (props: LikeButtonProps) => {

  const { artistId } = props

  const router = useRouter();

  const supabaseClient = createClient()

  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      // Ensure user?.id and artistId are defined before making the query
      if (!user?.id || !artistId) {
        console.error("User ID or Artist ID is undefined.");
        setIsLiked(false);
        return;
      }
  
      const { data, error } = await supabaseClient
        .from('liked_artist')
        .select('*')
        .eq('user_id', user.id)
        .eq('artist_id', artistId);
  
      if (error) {
        console.log(error);
        console.error("Error fetching liked song:", error.message);
        setIsLiked(false); // Handle the error state as appropriate
        return;
      }
  
      setIsLiked(data.length > 0);
    };
  
    fetchData();
  }, [artistId, supabaseClient, user?.id]);
  

  

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;


  const handleLike = async () => {

    if (isLiked) {

      const { error } = await supabaseClient
        .from('liked_artist')
        .delete()
        .eq('user_id', user?.id)
        .eq('artist_id', artistId)

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabaseClient
        .from('liked_artist')
        .insert({
          artist_id: artistId,
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

export default LikeUserButton;