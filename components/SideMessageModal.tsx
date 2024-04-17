"use client";

import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from 'uuid'; 
import SearchInput from "./SearchInput";
import Image from "next/image";


interface MessageModalProps {
  sideMessageModalOpen: boolean;
  setSideMessageModalOpen: Function;
}

const SideMessageModal = (props: MessageModalProps) => {
  
  const { sideMessageModalOpen, setSideMessageModalOpen } = props;

  const supabase = createClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [ searchedUser, setSearchedUser ] = useState<string>('')

  const [ resultUsers , setResultUsers ] = useState<Profile[] | null>()

  const [ selectedUser , setSelectedUser ] = useState<Profile | null>(null)

  const { user } = useUser();


  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSideMessageModalOpen(false);
    }
  };


  const handleClick = (resultUser: Profile) => {

    setSearchedUser('')

    setSelectedUser(resultUser)

  }


  useEffect(() => {
    if (searchedUser.trim()) {  // Only perform the search if the input is not empty
      (async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", user?.id)
          .ilike("username", `%${searchedUser}%`);  // Using ilike for case-insensitive matching, and wrapping searchedUser with '%' wildcards
          
        if (error) {
          console.error("Error fetching profiles:", error.message);
          return;
        }
        setResultUsers(data as Profile[]);
      })();
    } else {
      setResultUsers([]);  // Clear results if the search input is empty
    }
  }, [searchedUser, supabase]);








  const onSubmit: SubmitHandler<FieldValues> = async (values) => {

    if (selectedUser === null) {
        toast.error("No user selected")
        return
    }


    const uniqid = uuidv4()


    try {



      setIsLoading(true);



      const { data: existingConversations, error: existingConversationsError } = await 
      supabase.rpc("check_conversation_exist", { userid1: user?.id, userid2: selectedUser?.id });
  

      if ( existingConversations != null ) {

        const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: existingConversations,
          sender_id: user?.id,
          content: values.message,
          seen: false,
        })


      }

      else {

      // adding empty conversation
      const { error: conversationError } = await supabase
        .from("conversations")
        .insert({
          conversation_id: uniqid
        })


      if (conversationError) {
        toast.error(conversationError.message);
        console.error("Error creating conversation:", conversationError);
        return { error: conversationError || "No conversation data returned" };
      }

      // adding current user to conversation_participants
      const { error: addingUsersError } = await supabase
        .from("conversation_participants")
        .insert([
          {
          conversation_id: uniqid,
          user_id: user?.id,
          },
          {
            conversation_id: uniqid,
            user_id: selectedUser?.id,
          }
      ]);

      if (addingUsersError) {
        toast.error(addingUsersError.message);
        console.log(addingUsersError);
      }


      //adding message from current user to other user
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: uniqid,
        sender_id: user?.id,
        content: values.message,
        seen: false,
      });

      if (messageError) {
        toast.error(messageError.message);
        console.log(messageError);
      }


    }


      router.push(`/messages/${uniqid}`);

      toast.success("Message sent!");
      reset();
      setSideMessageModalOpen(false);



    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Modal
      title="Send Message"
      description="Search for person you'd like to speak with"
      isOpen={sideMessageModalOpen}
      onChange={onChange}
    >
      <form
        className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
      >
        {
            selectedUser && 
            <div className="flex flex-col w-full justify-center items-center align-middle">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={selectedUser.avatar_url || "/default-avatar.png"} // Fallback to a default image if none is provided
                    alt="User Avatar"
                    layout="fill"
                    className="object-cover" // Ensures the image covers the div completely
                  />
                </div>
                <span>{selectedUser.username}</span>

            </div>
        }

        <Input
          placeholder="Search for username"
          value={searchedUser}
          onChange={(e) => setSearchedUser(e.target.value)}
        />

        {resultUsers != undefined && resultUsers?.length > 0 && (

          <div 
          className="
          flex 
          flex-col 
          gap-4 
          w-full 
          rounded-md 
          bg-neutral-700 
          border 
          border-transparent
          px-3 
          py-3 
          text-sm 
          disabled:cursor-not-allowed 
          disabled:opacity-50 
          focus:outline-none
          max-h-[150px]
          overflow-auto
          "
          >

            {resultUsers?.map((resultUser) => (

              <div 
                className="hover:bg-neutral-500 p-2 rounded-md cursor-pointer flex items-center gap-2"
                onClick={ () => handleClick(resultUser)}
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={resultUser.avatar_url || "/default-avatar.png"} // Fallback to a default image if none is provided
                    alt="User Avatar"
                    layout="fill"
                    className="object-cover" // Ensures the image covers the div completely
                  />
                </div>
                <span className="text-white truncate">
                  {resultUser.username}
                </span>
              </div>

            ))}

          </div>

        )}

        <Input
          id="message"
          disabled={isLoading}
          {...register("message", { required: true })}
          placeholder="type your message here..."
        />

        <Button disabled={isLoading} type="submit">
          Send
        </Button>
      </form>
    </Modal>
  );
};

export default SideMessageModal;
