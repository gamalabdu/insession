"use client"

import AuthModal from "@/components/AuthModal"
import EditProfileModal from "@/components/EditProfileModal"
import MessageModal from "@/components/MessageModal"
import PostSessionModal from "@/components/PostSessionModal"
import ProfileSetupModal from "@/components/ProfileSetupModal"
import UploadModal from "@/components/UploadModal"
import { useEffect, useState } from "react"

const ModalProvider = () => {

    const [ isMounted, setIsMounted ] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) { return null }

    return (
        <>
        <AuthModal/>
        <UploadModal />
        <ProfileSetupModal />
        <PostSessionModal />
        <EditProfileModal />
        <MessageModal />
        </>
    )
}

export default ModalProvider