"use client";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import Modal from "./Modal";
import useUploadModal from "@/hooks/useUploadModal";
import { FieldValues, useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import { LuFileAudio } from "react-icons/lu";
import SelectGenres from "./SelectGenres";
import { Genre } from "@/types";
import { uploadSong } from "@/actions/songs";
import { getAudioDuration } from "@/utils/songs";

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [filePreview, setFilePreview] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [isPending, startTransition] = useTransition();
  const [durationLoading, setDurationLoading] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);

  const { register, reset, watch } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      song: null,
      image: null,
      bpm: "",
      key: "",
      genre: selectedGenres,
    },
  });

  const songWatch = watch("song");

  useEffect(() => {
    if (songWatch && songWatch.length > 0) {
      const file = songWatch[0];
      const objectUrl = URL.createObjectURL(file);
      setFilePreview({
        name: file.name,
        url: objectUrl,
      });
      // Cleanup function to revoke the object URL
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setFilePreview(null);
    }
  }, [songWatch]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = function (e: ProgressEvent<FileReader>) {
        setImagePreviewUrl(e.target?.result as string);
      };
      fileReader.readAsDataURL(event.target.files[0]);
    }
  };

  const onSongChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length < 1) return;
    setDurationLoading(true);
    const songDuration = await getAudioDuration(e.target.files[0]);
    setDuration(songDuration);
    setDurationLoading(false);
  };

  const onChange = (open: boolean) => {
    if (!open) {
      setImagePreviewUrl("");
      setFilePreview(null);
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit = (formData: FormData) =>
    startTransition(async () => {
      const { error } = await uploadSong(formData);
      if (error) {
        toast.error(error);
      } else {
        setImagePreviewUrl("");
        toast.success("Song created!");
        setSelectedGenres([]);
        setFilePreview(null);
        uploadModal.onClose();
        reset();
      }
    });

  return (
    <Modal
      title="Add a song"
      description="Upload and mp3 or Wav file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-4" action={onSubmit}>
        <Input
          id="title"
          disabled={isPending}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        <div>
          {filePreview && (
            <div className="flex flex-col items-center align-middle mb-1">
              <div className="flex items-center align-middle gap-4">
                <LuFileAudio />
                <span>{filePreview.name}</span>
              </div>
              <audio controls src={filePreview.url}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <div className="pb-1 text-sm">Select a song file</div>

          <Input
            id="song"
            type="file"
            disabled={isPending}
            {...register("song", { required: true })}
            accept=".mp3 , .wav"
            onChange={onSongChange}
          />
        </div>

        <Input
          id="bpm"
          type="text"
          disabled={isPending}
          {...register("bpm", { required: true })}
          placeholder=" BPM ex: 145"
        />

        <Input
          id="key"
          type="text"
          disabled={isPending}
          {...register("key", { required: true })}
          placeholder="Key ex: C Maj"
        />

        <SelectGenres
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          user_id={user?.id || ""}
          isSong={true}
        />
        <div>
          <div className="flex flex-col items-center align-middle mb-1">
            {imagePreviewUrl && (
              <Image
                src={imagePreviewUrl}
                width={80}
                height={80}
                alt="Profile Preview"
                className="object-cover"
              />
            )}
          </div>
          <div className="pb-1">Select a cover art</div>
          <Input
            id="image"
            type="file"
            disabled={isPending}
            {...register("image", { required: true })}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <input
          type="hidden"
          name="genres"
          value={JSON.stringify(selectedGenres)}
        />
        <input
          type="hidden"
          value={duration || ""}
          name="duration"
          id="duration"
        />
        <Button disabled={isPending || durationLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
