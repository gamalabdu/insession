"use client";

import React, { useState } from "react";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from 'uuid'; 
import Input from "../Input";
import Button from "../Button";
import Modal from "../Modal";


interface MessageModalProps {
  messageModalOpen: boolean;
  setMessageModalOpen: Function;
  userProfileInfo: Profile;
}

const MessageModal = (props: MessageModalProps) => {
  
  const { messageModalOpen, setMessageModalOpen, userProfileInfo } = props;

  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setMessageModalOpen(false);
    }
  };



  const onSubmit: SubmitHandler<FieldValues> = async (values) => {


    const uniqid = uuidv4()


    try {

      setIsLoading(true);

      const { data: existingConversations, error: existingConversationsError } = await 
      supabase.rpc("check_conversation_exist", { userid1: user?.id, userid2: userProfileInfo.id });
  

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
            user_id: userProfileInfo.id,
          }
      ]);

      if (addingUsersError) {
        toast.error(addingUsersError.message);
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
      }


    }


      // router.push(`/messages/${uniqid}`);

      toast.success("Message sent!");
      reset();
      setMessageModalOpen(false);



    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

















  return (
    <Modal
      title="Send a message"
      description="say hi or ask if they are intrested in working"
      isOpen={messageModalOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
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

export default MessageModal;
