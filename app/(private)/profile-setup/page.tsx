"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { register } from "module";
import React, { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

const ProfileSetup = () => {
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      avatar_url: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {};

  return (
    <div className="flex items-center justify-center align-middle w-full h-full">

        <div className="border w-1/3 p-5">

        <form
          className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="username"
            disabled={isLoading}
            {...register("username", { required: true })}
            placeholder="Username"
          />

          <Input
            id="email"
            disabled={isLoading}
            {...register("email", { required: true })}
            placeholder="Email"
          />

          <select className="rounded-md p-2" defaultValue={1}>
            <option> Select a genre </option>
            <option> Hip Hop </option>
            <option> Rnb </option>
            <option> Pop </option>
            <option> Reggaeton </option>
            <option> Indie </option>
            <option> Acoustic </option>
          </select>

          <div>
            <div className="pb-1">Select a profile image</div>

            <Input
              id="avatar_url"
              type="file"
              disabled={isLoading}
              {...register("avatar_url", { required: true })}
              accept="image/*"
            />
          </div>

          <div className="text-sm text-center text-neutral-400">
            {" "}
            Don't worry you'll be able to add more once your profile is setup!{" "}
          </div>

          <Button disabled={isLoading} type="submit">
            Finish Profile
          </Button>
        </form>

        </div>

    </div>
  );
};

export default ProfileSetup;
