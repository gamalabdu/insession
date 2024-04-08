"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Input from "./Input";
import Button from "./Button";
import useLoadProfileImage from "@/hooks/useLoadProfileImage";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types";
import Image from "next/image";
import { supabase } from "@supabase/auth-ui-shared";

const EditProfileModal = ({
  userProfileInfo,
}: {
  userProfileInfo: Profile;
}) => {
  const supabaseClient = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //   const currentProfileImage = useLoadProfileImage(userProfileInfo);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    userProfileInfo.avatar_url
  );
  const [fileSelected, setFileSelected] = useState(false);

  //   useEffect(() => {
  //     // This effect will update the image preview whenever currentProfileImage changes
  //     if (currentProfileImage) {
  //       setImagePreviewUrl(currentProfileImage);
  //     }
  //   }, [currentProfileImage]);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FieldValues>({
      defaultValues: {
        username: userProfileInfo?.username,
        email: userProfileInfo?.email,
        first_name: userProfileInfo?.first_name,
        last_name: userProfileInfo?.last_name,
        avatar_url: userProfileInfo?.avatar_url,
      },
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFileSelected(true);
      const fileReader = new FileReader();
      fileReader.onload = function (e: ProgressEvent<FileReader>) {
        setImagePreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setIsOpen(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);

    try {
      const profileImage = values.avatar_url?.[0];

      const uniqueID = uniqid();

      const { data: profileImageData, error: profileImageError } =
        await supabaseClient.storage
          .from("profile-images")
          .upload(`image-${values.username}-${uniqueID}`, profileImage, {
            cacheControl: "3600",
            upsert: false,
          });

      if (profileImageError) {
        throw profileImageError;
      }

      const { data: imageDataUrl } = supabaseClient.storage
        .from("profile-images")
        .getPublicUrl(`image-${values.username}-${uniqueID}`);

      if (values.email !== userProfileInfo.email) {
        const { error: emailError } = await supabaseClient.auth.updateUser({
          email: values.email,
        });
        if (emailError) {
          throw emailError;
        }
      }

      const { error: supabaseError } = await supabaseClient
        .from("profiles")
        .update({
          first_name: values["first-name"],
          last_name: values["last-name"],
          username: values.username,
          email: values.email,
          avatar_url: imageDataUrl.publicUrl,
        })
        .eq("id", userProfileInfo.id);

      if (supabaseError) {
        throw supabaseError;
      }

      toast.success("Profile updated!");
      reset(values); // Reset form with new values to set a new baseline for "changes detection"
      router.refresh();
      setIsLoading(false);
      reset();
      setIsOpen(false);
    } catch (error) {
      toast.error(`Update failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Edit Account Info</Button>
      <Modal title="" description="" isOpen={isOpen} onChange={onChange}>
        <form
          className="flex flex-col gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="username"
            disabled={isLoading}
            {...register("username")}
            placeholder="Display name"
          />

          <Input
            id="email"
            disabled={isLoading}
            {...register("email")}
            placeholder="Email"
          />

          <div className="flex flex-col justify-center">
            {imagePreviewUrl && (
              <Image
                src={imagePreviewUrl}
                width={80}
                height={80}
                alt="Profile Preview"
                className="object-cover"
              />
            )}

            <div className="pb-1">Select a profile image</div>
            <Input
              id="avatar_url"
              type="file"
              disabled={isLoading}
              {...register("avatar_url")}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* <div className='text-sm text-center text-neutral-400'> Don't worry you'll be able to add more once your profile is setup! </div> */}

          <Button disabled={isLoading} type="submit">
            Update Profile
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default EditProfileModal;
