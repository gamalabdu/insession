"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import Input from "./Input";
import Button from "./Button";
import useGetUserProfileInfo from "@/hooks/useGetUserProfileInfo";
import usePostSessionModal from "@/hooks/usePostSessionModal";
import uniqid from 'uniqid'
import { createClient } from "@/utils/supabase/client";

const PostSessionModal = () => {
    
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { user } = useUser();

  const postSessionModal = usePostSessionModal();

  const { userProfileInfo } = useGetUserProfileInfo(user?.id)

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      created_by: "",
      job_title: "",
      job_description: "",
      additional_info: "",
      genre: "",
      budget: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      postSessionModal.onClose();
    }
  };


  const onSubmit: SubmitHandler<FieldValues> = async (values) => {


    try {

      setIsLoading(true);


      const { error: supabaseError } = await supabase
        .from("jobs")
        .insert({
            user_id: user?.id,
            created_by: userProfileInfo?.username,
            job_title: values.job_title,
            job_description: values.job_description,
            additional_info: values.additional_info,
            genre: values.genre,
            budget: values.budget,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Session Posted!");
      reset();
      postSessionModal.onClose();

    } catch (error) {

      toast.error("Something went wrong.")

    } finally {

      setIsLoading(false)

    }

  }

  return (
    <Modal
      title="Let's get you in a session"
      description="One step away from posting!"
      isOpen={postSessionModal.isOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="job_title"
          disabled={isLoading}
          {...register("job_title", { required: true })}
          placeholder="ex: Kanye type beat"
        />

        <Input
          id="job_description"
          disabled={isLoading}
          {...register("job_description", { required: true })}
          placeholder="ex: Need an instrumental"
        />


        <Input
          id="additional_info"
          disabled={isLoading}
          {...register("additional_info", { required: true })}
          placeholder="ex: I'm looking to get this done in a week"
        />

        <Input
          id="genre"
          disabled={isLoading}
          {...register("genre", { required: true })}
          placeholder="HipHop & Rnb"
        />

        <Input
          id="budget"
          type="number"
          disabled={isLoading}
          {...register("budget", { required: true })}
          placeholder="300"
        />

        <Button disabled={isLoading} type="submit">
          Post Session
        </Button>
      </form>

    </Modal>
  );
};

export default PostSessionModal;
