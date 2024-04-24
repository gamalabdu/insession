"use client"
import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import useUploadModal from '@/hooks/useUploadModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import toast from 'react-hot-toast'
import { useUser } from '@/hooks/useUser'
import uniqid from 'uniqid'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { LuFileAudio } from 'react-icons/lu'
import SelectGenres from './SelectGenres'

const UploadModal = () => {

    const uploadModal = useUploadModal()

    const supabase = createClient()

    const router = useRouter()

    const [ isLoading, setIsLoading ] = useState(false)

    const { user, userDetails } = useUser()

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const [fileSelected, setFileSelected] = useState(false);

    const [filePreview, setFilePreview] = useState<{ name: string, url: string} | null>(null);

    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


    function formatDuration(durationInSeconds : number) {
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = Math.floor(durationInSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    


    const getAudioDuration = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
    
      audio.onloadedmetadata = () => {
        const formattedDuration = formatDuration(audio.duration);
        resolve(formattedDuration); // Resolve with the formatted duration string
        URL.revokeObjectURL(audio.src); // Clean up object URL
      };
    
      audio.onerror = () => {
        reject(new Error('Failed to load audio file'));
        URL.revokeObjectURL(audio.src); // Clean up object URL
      };
    });


    const { register, handleSubmit, reset, watch } = useForm<FieldValues>({

        defaultValues: {
            title: '',
            song: null,
            image: null,
            bpm: '',
            key: '',
            genre: selectedGenres
        }
    })

    const songWatch = watch('song')



    useEffect(() => {
        if (songWatch && songWatch.length > 0) {
            const file = songWatch[0];
            const objectUrl = URL.createObjectURL(file);
            setFilePreview({
                name: file.name,
                url: objectUrl
            });
            // Cleanup function to revoke the object URL
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setFilePreview(null);
        }
    }, [songWatch]);



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

    const onChange = (open : boolean) => {

        if ( !open ) {
            setImagePreviewUrl('')
            setFilePreview(null)
            setFileSelected(false)
            reset()
            uploadModal.onClose()
        }

    }


    const onSubmit : SubmitHandler<FieldValues> = async (values) => {

        try {

            setIsLoading(true)

            const imageFile = values.image?.[0]
            const songFile = values.song?.[0]

            if ( !imageFile || !songFile ) {

                    toast.error("Missing fields")
                    return
            }

            const uniqueID = uniqid()

            const duration = await getAudioDuration(songFile);

            // extracting the response from the client
            const { data: songData , error: songError  } = await supabase
            .storage
            .from('songs')
            .upload(`song-${values.title}-${uniqueID}`, songFile, {
                cacheControl: '3600',
                upsert: false
            })

            if ( songError ) {
                setIsLoading(false)
                return toast.error(songError.message)
            }



             // extracting the response from the client
             const { data: imageData , error: imageError  } = await supabase
             .storage
             .from('images')
             .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                 cacheControl: '3600',
                 upsert: false
             })


             if ( imageError ) {
                setIsLoading(false)
                return toast.error("Failed image upload")
            }

            const { data: songUrl } = supabase.storage
            .from('songs')
            .getPublicUrl(`song-${values.title}-${uniqueID}`)

            const { data: imageUrl } = supabase.storage
            .from('images')
            .getPublicUrl(`image-${values.title}-${uniqueID}`)

            const { error: supabaseError } = await supabase
            .from('songs')
            .insert({ 
                user_id: user?.id,
                title: values.title,
                username: userDetails?.username,
                image_path: imageUrl.publicUrl,
                song_path: songUrl.publicUrl,
                duration: duration,
                bpm: values.bpm,
                key: values.key
            })

            if ( supabaseError ) {
                setIsLoading(false)
                return toast.error(supabaseError.message)
            }


            router.refresh()
            setIsLoading(false)
            toast.success("Song created!")
            reset()
            setFilePreview(null)
            setFileSelected(false)
            uploadModal.onClose()


        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }


    } 


  return (
    <Modal
      title="Add a song"
      description="Upload and mp3 or Wav file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />

        <div>

          {filePreview && (
            <div className='flex flex-col items-center align-middle mb-1'>
              <div className='flex items-center align-middle gap-4'>
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
            disabled={isLoading}
            {...register("song", { required: true })}
            accept=".mp3 , .wav"
          />
        </div>


        <Input id="bpm" type="text" disabled={isLoading} {...register("bpm", { required: true })} placeholder=' BPM ex: 145' />

        <Input id="key" type="text" disabled={isLoading} {...register("key", { required: true })} placeholder='Key ex: C Maj' />

        <SelectGenres selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />


        <div>

        <div className='flex flex-col items-center align-middle mb-1'>
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
            disabled={isLoading}
            {...register("image", { required: true })}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal