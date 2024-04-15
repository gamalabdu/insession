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
import useBidModal from '@/hooks/useBidModal'
import { twMerge } from 'tailwind-merge'

const BidModal = () => {

    const bidModal = useBidModal()

    const supabase = createClient()

    const router = useRouter()

    const [ isLoading, setIsLoading ] = useState(false)

    const { user, userDetails } = useUser()

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    const [fileSelected, setFileSelected] = useState(false);

    const [filePreview, setFilePreview] = useState<{ name: string, url: string} | null>(null);

    const { register, handleSubmit, reset, watch } = useForm<FieldValues>({

        defaultValues: {
            title: '',
            proposal:'',
        }
    })



    const onChange = (open : boolean) => {

        if ( !open ) {
            setImagePreviewUrl('')
            setFilePreview(null)
            setFileSelected(false)
            reset()
            bidModal.onClose()
        }

    }


    const onSubmit : SubmitHandler<FieldValues> = async (values) => {

        try {

            setIsLoading(true)

            const uniqueID = uniqid()

            const { error: supabaseError } = await supabase
            .from('songs')
            .insert({ 
                title: values.title,
                proposal: values.proposal
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
            bidModal.onClose()


        } catch (error) {
            console.log(error)
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }


    } 


  return (
    <Modal
      title="Bid on this Session"
      description="Bidding Time!"
      isOpen={bidModal.isOpen}
      onChange={onChange}
    >
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmit)}>

       
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Bid Title"
        />

        {/* <Input
          id="proposal"
          type='textarea'
          disabled={isLoading}
          style={{ wordBreak:"break-all", height:"100px"}}
          {...register("proposal", { required: true })}
          placeholder="Describe your work"
        /> */}

        <textarea className={twMerge(`
                    flex
                    w-full
                    rounded-md
                    bg-neutral-700
                    border
                    border-transparent
                    px-3
                    py-3
                    text-sm
                    file:border-0
                    file:bg-transparent
                    file:text-sm
                    file:font-medium
                    placeholder:text-neutral-400
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    focus:outline-none
                `,
                )} placeholder='Describe your work.'/>

       
        <Button disabled={isLoading} type="submit">
          Send Bid
        </Button>

      </form>
    </Modal>
  );
}

export default BidModal