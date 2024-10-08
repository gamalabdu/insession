// "use client";
// import React, { useEffect, useState } from "react";

// import { useRouter } from "next/navigation";
// import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
// import { useUser } from "@/hooks/useUser";
// import toast from "react-hot-toast";
// import { createClient } from "@/utils/supabase/client";
// import uniqid from "uniqid";
// import { LuFileAudio } from "react-icons/lu";

// import { Genre } from "@/types";
// import Modal from "../Modal";
// import Input from "../Input";
// import SelectGenres from "../SelectGenres";
// import Button from "../Button";


// interface PostSessionModalProps {
//   isPrivate?: boolean
//   userProfile?: Profile
//   postModalOpen: boolean
//   setPostModalOpen: Function
// }


// const PostSessionModal = (props: PostSessionModalProps) => {

//   const { isPrivate, userProfile, postModalOpen, setPostModalOpen } = props
    
//   const supabase = createClient();

//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();

//   const { user, userDetails } = useUser();

//   const [filePreviews, setFilePreviews] = useState<{ name: string, url: string}[]>([]);
//   const [youtubePreview, setYoutubePreview] = useState("");
//   const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

//   //add the ability to upload a refrence via link or audio file

//   const { register, handleSubmit, reset, watch } = useForm<FieldValues>({
//     defaultValues: {
//       job_title: "",
//       job_description: "",
//       additional_info: "",
//       reference_link: "",
//       reference_files: null,
//       genre: "",
//       budget: null,
//     },
//   });

//   const referenceFiles : File[] = watch("reference_files");
//   const referenceLink = watch("reference_link");



//   useEffect(() => {
    
//     if (referenceFiles && referenceFiles.length > 0) {
//       const newFilePreviews = Array.from(referenceFiles).map((file) => ({
//         name: file.name,
//         url: URL.createObjectURL(file),
//       }));
//       setFilePreviews(newFilePreviews);
//     } else {
//       setFilePreviews([]);
//     }
//   }, [referenceFiles]);



//   useEffect(() => {
//     if (referenceLink) {
//       // Extract the video ID from the YouTube URL
//       const videoIdMatch = referenceLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[^\/\n\s]+)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
//       const videoId = videoIdMatch ? videoIdMatch[1] : null;
  
//       if (videoId) {
//         // Set the iframe src to the embed URL using the extracted video ID
//         setYoutubePreview(`https://www.youtube.com/embed/${videoId}`);
//       } else {
//         setYoutubePreview("");
//       }
//     } else {
//       setYoutubePreview("");
//     }
//   }, [referenceLink]);

  

//   const onChange = (open: boolean) => {
//     if (!open) {
//       reset();
//       setPostModalOpen(false)
 
//     }
//   };


//   // somewhere here we need to see if a user has already sent a session to a given user and not let them send another one

//   const onSubmit: SubmitHandler<FieldValues> = async (values) => {

//     try {


//       setIsLoading(true);
  
//       const referenceFiles: File[] = Array.from(values.reference_files);
//       const uploadedFilesData: { name: string; url: string }[] = [];
  
//       // Uploading all songs
//       for (const referenceFile of referenceFiles) {
//         const fileUniqueID = uniqid();
//         const filePath = `reference-${referenceFile.name}-${fileUniqueID}`;
//         const { error, data } = await supabase.storage.from('job-files').upload(filePath, referenceFile, {
//           cacheControl: '3600',
//           upsert: false,
//         });
  
//         if (error) {
//           throw error;
//         }
  
//         const { data: referenceUrl } = supabase.storage.from("job-files").getPublicUrl(filePath);
//         uploadedFilesData.push({ name: referenceFile.name, url: referenceUrl.publicUrl }); // Ensure the URL is valid before adding

//       }
  
//       // Inserting data into jobs table directly using uploadedUrls
//       const { data: jobData, error: supabaseError } = await supabase
//         .from("jobs")
//         .insert({
//           user_id: user?.id,
//           created_by: userDetails?.username,
//           job_title: values.job_title,
//           job_description: values.job_description,
//           additional_info: values.additional_info,
//           reference_link : values.reference_link,
//           reference_files: uploadedFilesData,
//           budget: values.budget,
//           job_type: isPrivate ? "private" : "public",
//           receiver_id: isPrivate ? userProfile?.id : null
//         })
//         .select('job_id')


  
//       if (supabaseError) {
//         throw supabaseError;
//       }


//       const genreInserts = selectedGenres.map((genre) => ({
//         job_id: jobData[0].job_id,
//         genre_id: genre.id
//       }));
  
//       // Batch insert genres
//       const { error: profilesGenreError } = await supabase
//         .from('jobs_genres')
//         .insert(genreInserts);
  
//       if (profilesGenreError) {
//         toast.error(profilesGenreError.message);
//       }


//       // Success handling
//       router.refresh();
//       toast.success("Session Posted!");
//       setSelectedGenres([])


//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong.");

//     } finally {
//       setIsLoading(false);
//       reset();
//       // postSessionModal.onClose();
//       setPostModalOpen(false)
//     }

//   }
  


//   return (
//     <Modal
//       title="Let's get you in a session"
//       description=""
//       isOpen={postModalOpen}
//       onChange={onChange}
//     >
//       <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
//         <Input
//           id="job_title"
//           disabled={isLoading}
//           {...register("job_title", { required: true })}
//           placeholder="Title - ex: Kanye type beat"
//         />

//         <Input
//           id="job_description"
//           disabled={isLoading}
//           {...register("job_description", { required: true })}
//           placeholder="Description - ex: Need an instrumental"
//         />

//         <Input
//           id="additional_info"
//           disabled={isLoading}
//           {...register("additional_info", { required: true })}
//           placeholder="Additional Info - ex: I'm looking to get this done in a week"
//         />

//         <SelectGenres
//           selectedGenres={selectedGenres}
//           setSelectedGenres={setSelectedGenres}
//           isSongOrBid 
//         />

//         <Input
//           id="budget"
//           type="number"
//           disabled={isLoading}
//           {...register("budget", { required: true })}
//           placeholder="Dollar Amount ex: 4000"
//         />

//         <div>
//           {filePreviews.map((preview, index) => (
//             <div key={index} className="flex flex-col items-center align-middle mb-1">
//               <div className="flex items-center align-middle gap-4">
//                 <LuFileAudio />
//                 <span>{preview.name}</span>
//               </div>
//               <audio controls src={preview.url}>
//                 Your browser does not support the audio element.
//               </audio>
//             </div>
//           ))}
//         </div>

//         <Input
//           id="reference_files"
//           multiple
//           type="file"
//           disabled={isLoading}
//           {...register("reference_files")}
//           accept=".mp3 , .wav"
//         />

//         {/* YouTube Link Preview */}
//         {youtubePreview && (
//           <div className="h-full w-full">
//             <iframe
//               width="100%"
//               height="100%"
//               src={youtubePreview}
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//               title="YouTube video player"
//             ></iframe>
//           </div>
//         )}

//         <Input
//           id="reference_link"
//           type="url"
//           disabled={isLoading}
//           {...register("reference_link")}
//           accept=".mp3 , .wav"
//           placeholder="YouTube Link - https://example.com"
//           pattern="https://.*"
//         />

//         <Button disabled={isLoading} type="submit">
//           Post Session
//         </Button>
//       </form>
//     </Modal>
//   );
// };

// export default PostSessionModal;










"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";
import uniqid from "uniqid";
import { LuFileAudio } from "react-icons/lu";

import { Genre } from "@/types";
import Modal from "../Modal";
import Input from "../Input";
import SelectGenres from "../SelectGenres";
import Button from "../Button";

interface PostSessionModalProps {
  isPrivate?: boolean;
  userProfile?: Profile;
  postModalOpen: boolean;
  setPostModalOpen: Function;
}

const PostSessionModal = (props: PostSessionModalProps) => {

  const { isPrivate, userProfile, postModalOpen, setPostModalOpen } = props;

  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, userDetails } = useUser();

  const [filePreviews, setFilePreviews] = useState<{ name: string; url: string }[]>([]);
  const [youtubePreview, setYoutubePreview] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);


  // Add the ability to upload a reference via link or audio file
  const { register, handleSubmit, reset, watch } = useForm<FieldValues>({
    defaultValues: {
      job_title: "",
      job_description: "",
      additional_info: "", // Optional
      reference_link: "", // Optional
      reference_files: null, // Optional
      genre: "",
      budget: null,
    },
  });

  const referenceFiles: File[] = watch("reference_files");
  const referenceLink = watch("reference_link");

  useEffect(() => {
    if (referenceFiles && referenceFiles.length > 0) {
      const newFilePreviews = Array.from(referenceFiles).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setFilePreviews(newFilePreviews);
    } else {
      setFilePreviews([]);
    }
  }, [referenceFiles]);

  useEffect(() => {
    if (referenceLink) {
      // Extract the video ID from the YouTube URL
      const videoIdMatch = referenceLink.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[^\/\n\s]+)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : null;

      if (videoId) {
        // Set the iframe src to the embed URL using the extracted video ID
        setYoutubePreview(`https://www.youtube.com/embed/${videoId}`);
      } else {
        setYoutubePreview("");
      }
    } else {
      setYoutubePreview("");
    }
  }, [referenceLink]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setPostModalOpen(false);
    }
  };

  // Somewhere here we need to see if a user has already sent a session to a given user and not let them send another one
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const referenceFiles: File[] = Array.from(values.reference_files || []);
      const uploadedFilesData: { name: string; url: string }[] = [];

      // Uploading all songs
      for (const referenceFile of referenceFiles) {
        const fileUniqueID = uniqid();
        const filePath = `reference-${referenceFile.name}-${fileUniqueID}`;
        const { error, data } = await supabase.storage.from('job-files').upload(filePath, referenceFile, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          throw error;
        }

        const { data: referenceUrl } = supabase.storage.from("job-files").getPublicUrl(filePath);
        uploadedFilesData.push({ name: referenceFile.name, url: referenceUrl.publicUrl }); // Ensure the URL is valid before adding
      }

      // Inserting data into jobs table directly using uploadedUrls
      const { data: jobData, error: supabaseError } = await supabase
        .from("jobs")
        .insert({
          user_id: user?.id,
          created_by: userDetails?.username,
          job_title: values.job_title,
          job_description: values.job_description,
          additional_info: values.additional_info,
          reference_link: values.reference_link,
          reference_files: uploadedFilesData,
          budget: values.budget,
          job_type: isPrivate ? "private" : "public",
          receiver_id: isPrivate ? userProfile?.id : null,
        })
        .select('job_id');

      if (supabaseError) {
        throw supabaseError;
      }

      const genreInserts = selectedGenres.map((genre) => ({
        job_id: jobData[0].job_id,
        genre_id: genre.id,
      }));

      // Batch insert genres
      const { error: profilesGenreError } = await supabase
        .from('jobs_genres')
        .insert(genreInserts);

      if (profilesGenreError) {
        toast.error(profilesGenreError.message);
      }

      // Success handling
      router.refresh();
      toast.success("Session Posted!");
      setSelectedGenres([]);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      reset();
      setPostModalOpen(false);
    }
  };

  return (
    <Modal
      title="Let's get you in a session"
      description=""
      isOpen={postModalOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="job_title"
          disabled={isLoading}
          {...register("job_title", { required: true })}
          placeholder="Session Title"
        />

        <Input
          id="job_description"
          disabled={isLoading}
          {...register("job_description", { required: true })}
          placeholder="Session Description"
        />

        <Input
          id="additional_info"
          disabled={isLoading}
          {...register("additional_info")}
          placeholder="Additional Info - (optional)"
        />

        <SelectGenres
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          isSongOrBid 
        />

        <Input
          id="budget"
          disabled={isLoading}
          {...register("budget", { required: true })}
          placeholder="Budget Amount"
        />

        <div>
          {filePreviews.map((preview, index) => (
            <div key={index} className="flex flex-col items-center align-middle mb-1">
              <div className="flex items-center align-middle gap-4">
                <LuFileAudio />
                <span>{preview.name}</span>
              </div>
              <audio controls src={preview.url}>
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>

        <Input
          id="reference_files"
          multiple
          type="file"
          disabled={isLoading}
          {...register("reference_files")}
          accept=".mp3 , .wav"
          placeholder="Upload Reference Files (optional)"
        />

        {/* YouTube Link Preview */}
        {youtubePreview && (
          <div className="h-full w-full">
            <iframe
              width="100%"
              height="100%"
              src={youtubePreview}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            ></iframe>
          </div>
        )}

        <Input
          id="reference_link"
          type="url"
          disabled={isLoading}
          {...register("reference_link")}
          placeholder="YouTube Link - https://example.com (optional)"
          pattern="https://.*"
        />

        <Button disabled={isLoading} type="submit">
          Post Session
        </Button>
      </form>
    </Modal>
  );
};

export default PostSessionModal;

