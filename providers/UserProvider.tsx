"use client"

import { MyUserContextProvider } from "@/hooks/useUser"

interface UserProviderProps {
    children: React.ReactNode
}

const UserProvider = (props : UserProviderProps) => {

    const { children } = props 

    return (
        <MyUserContextProvider>
            { children }
        </MyUserContextProvider>
    )

}

export default UserProvider