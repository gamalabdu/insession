"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import uniqid from "uniqid";
import Input from "./Input";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import SelectGenres from "./SelectGenres";
import { Genre } from "@/types";

const EditProfileModal = ({
  userProfileInfo,
}: {
  userProfileInfo: Profile;
}) => {
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(userProfileInfo.avatar_url);

  const [fileSelected, setFileSelected] = useState(false);

  const currentImageName = imagePreviewUrl.split('/').pop();



  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FieldValues>({
      defaultValues: {
        username: userProfileInfo?.username,
        email: userProfileInfo?.email,
        first_name: userProfileInfo?.first_name,
        last_name: userProfileInfo?.last_name,
        avatar_url: userProfileInfo?.avatar_url,
        genres: userProfileInfo.genres
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

      const profileImage: string = values.avatar_url?.[0];

      const oldImageName = userProfileInfo.avatar_url.split('/').pop();

      const uniqueID = uniqid();



      if (fileSelected && oldImageName) {

        const { error : deleteOldPhotoError } = await supabase
        .storage
        .from('profile-images')
        .remove([oldImageName])
        
        if (deleteOldPhotoError) {
          toast.error(deleteOldPhotoError.message)
        }


        const { data: profileImageData, error: profileImageError } =
        await supabase.storage
          .from("profile-images")
          .upload(`image-${values.username}-${uniqueID}`, profileImage, {
            cacheControl: "3600",
            upsert: false,
          });

          if (profileImageError) {
            throw profileImageError;
          }


      }




      const { data: imageDataUrl } = supabase.storage
        .from("profile-images")
        .getPublicUrl(`image-${values.username}-${uniqueID}`);

      if (values.email !== userProfileInfo.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: values.email,
        });
        if (emailError) {
          throw emailError;
        }
      }




      const genreNames = selectedGenres.map(genre => genre.name);

      const { error: supabaseError } = await supabase
        .from("profiles")
        .update({
          first_name: values["first-name"],
          last_name: values["last-name"],
          username: values.username,
          email: values.email,
          avatar_url: fileSelected ? imageDataUrl.publicUrl : userProfileInfo.avatar_url,
          genres: genreNames
        })
        .eq("id", userProfileInfo.id);

      if (supabaseError) {
        throw supabaseError;
      }


      const genreInserts = selectedGenres.map((genre) => ({
        user_id: userProfileInfo.id,
        genre_id: genre.id,
        name: genre.name
      }));


      //deletes all user profiles genres
      const { error: deleteUserProfileGenresError } = await supabase
      .from('profiles_genres')
      .delete()
      .eq('user_id', userProfileInfo.id)

      if (deleteUserProfileGenresError ) {
        toast.error(deleteUserProfileGenresError.message)
      }

  
      // Batch insert genres
      const { error: profilesGenreError } = await supabase
        .from('profiles_genres')
        .insert(genreInserts);
  
      if (profilesGenreError) {
        toast.error(profilesGenreError.message);
      }



      toast.success("Profile updated!");
      reset(values); // Reset form with new values to set a new baseline for "changes detection"
      router.refresh();
      setIsLoading(false);
      setSelectedGenres([])
      reset();
      setIsOpen(false);



    } catch (error) {

      toast.error(`Update failed: ${error}`);


    } finally {

      setIsLoading(false);

    }


  }













  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Edit Account Info</Button>
      <Modal title="Update Your Profile" description="" isOpen={isOpen} onChange={onChange}>
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


        <SelectGenres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} user_id={userProfileInfo.id} />


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













