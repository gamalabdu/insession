"use client";
import { useState } from "react";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Input from "./Input";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types";
import SelectGenres from "./SelectGenres";

const ProfileSetupModal = ({
  userProfileInfo,
}: {
  userProfileInfo: Profile;
}) => {
  const defaultOpen = !userProfileInfo.is_enabled;
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      "first-name": "",
      "last-name": "",
      avatar_url: "",
      location: ""
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setIsOpen(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const supabase = createClient();
    try {
      setIsLoading(true);

      const profileImage = values.avatar_url?.[0];

      if (!profileImage) {
        toast.error("Missing fields");
        return;
      }

      const uniqueID = uniqid();

      // extracting the response from the client
      const { data: profileImageData, error: profileImageError } =
        await supabase.storage
          .from("profile-images")
          .upload(
            `image-${userProfileInfo.username}-${uniqueID}`,
            profileImage,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );

      if (profileImageError) {
        setIsLoading(false);
        return toast.error(profileImageError.message);
      }

      const { data: imageDataUrl } = supabase.storage
        .from("profile-images")
        .getPublicUrl(`image-${userProfileInfo.username}-${uniqueID}`);

      const { error: supabaseError } = await supabase
        .from("profiles")
        .update({
          loaction: values.location,
          first_name: values["first-name"],
          last_name: values["last-name"],
          avatar_url: imageDataUrl.publicUrl,
          is_enabled: true,
        })
        .eq("id", userProfileInfo.id);

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      setIsLoading(false);
      toast.success("Profile updated!");
      reset();
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Welcome"
      description="Lets get your profile setup"
      isOpen={isOpen}
      onChange={onChange}
      disableClose
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="first-name"
          disabled={isLoading}
          {...register("first-name", { required: true })}
          placeholder="First name"
        />

        <Input
          id="last-name"
          disabled={isLoading}
          {...register("last-name", { required: true })}
          placeholder="Last name"
        />

        <Input
          id="location"
          disabled={isLoading}
          {...register("location", { required: true })}
          placeholder="ex: New York City, NY"
        />

         <SelectGenres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />

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
          Don&apos;t worry you&apos;ll be able to add more once your profile is
          setup!{" "}
        </div>

        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default ProfileSetupModal;
