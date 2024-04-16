"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import useMessageModal from "@/hooks/useMessageModal";
import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";
import { createClient } from "@/utils/supabase/client";
import { Conversation, Profile } from "@/types";

interface MessageModalProps {
  messageModalOpen: boolean;
  setMessageModalOpen: Function;
  userProfileInfo: Profile;
}

const MessageModal = (props: MessageModalProps) => {
  
  const { messageModalOpen, setMessageModalOpen, userProfileInfo } = props;

  const supabase = createClient();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUser();

  // console.log( "This is user : ", user )
  // console.log( "This is other user : ", userProfileInfo )

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
    try {
      setIsLoading(true);

      // adding empty conversation
      const { data: conversationId, error: conversationError } = await supabase
        .from("conversations")
        .insert({})
        .select("conversation_id")
        .single();


      if (conversationError) {
        toast.error(conversationError.message);
        console.error("Error creating conversation:", conversationError);
        return { error: conversationError || "No conversation data returned" };
      }

      // adding current user to conversation_participants
      const { error: addingUser1Error } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: conversationId.conversation_id,
          user_id: user?.id,
        });

      if (addingUser1Error) {
        toast.error(addingUser1Error.message);
        console.log(addingUser1Error);
      }

      // adding user we are sending message too to conversation_participants
      const { error: addingUser2Error } = await supabase
        .from("conversation_participants")
        .insert({
          conversation_id: conversationId.conversation_id,
          user_id: userProfileInfo.id,
        });

      if (addingUser2Error) {
        toast.error(addingUser2Error.message);
        console.log(addingUser2Error);
      }

      //adding message from current user to other user
      const { error: messageError } = await supabase.from("messages").insert({
        conversation_id: conversationId.conversation_id,
        sender_id: user?.id,
        content: values.message,
        seen: false,
      });

      if (messageError) {
        toast.error(messageError.message);
        console.log(messageError);
      }

      router.push(`/messages/${conversationId.conversation_id}`);

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
