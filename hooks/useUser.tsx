import { Profile, Subscription, UserDetails } from "@/types";
import { User } from "@supabase/auth-helpers-nextjs";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
    accessToken: string | null,
    user: User | null,
    userDetails: UserDetails | null,
    isLoading: boolean,
    // subscription: Subscription | null,
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
    [propName: string] : any
}


export const MyUserContextProvider = ( props : Props ) => {

    const {
        session, 
        isLoading: IsLoadingUser, 
        supabaseClient: supabase
    } = useSessionContext()


    const user = useSupaUser()

    const accessToken = session?.access_token ?? null

    const [ isLoadingData, setIsLoadingData ] = useState(false)

    const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

    // const [subscription, setSubscription] = useState<Subscription | null>(null)

    const getUserDetails = () => supabase.from('profiles').select('*').maybeSingle()


    // const getSubscription = () => supabase.from('subscriptions')
    //     .select( '* , prices( * , products(*) )' )
    //     .in('status', ['trialing', 'active'] ) 
    //     .single()

    useEffect(() => {

        // if are logged in, and not loading and have not loaded the user detials and not loaded current description
        if ( 
            user 
            && !isLoadingData 
            && !userDetails 
            // && !subscription 
            ) {

            setIsLoadingData(true)

            Promise.allSettled([
                getUserDetails(), 
                // getSubscription(),
            ])
            .then((results) => {

                const userDetailsPromise = results[0]
                // const subscriptionPromise = results[1]

                if( userDetailsPromise.status === "fulfilled" ) {
                        setUserDetails(userDetailsPromise.value.data as UserDetails)
                }

                // if (subscriptionPromise.status === 'fulfilled') {
                //     setSubscription(subscriptionPromise.value.data as Subscription)
                // }
 

                setIsLoadingData(false)

            } )
        } else if (!user && !IsLoadingUser && !isLoadingData) {
            // setSubscription(null)
            setUserDetails(null)
        }
        
    }, [user, IsLoadingUser])



    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: IsLoadingUser || isLoadingData,
        // subscription
    }


    return <UserContext.Provider value={value} {...props} />

}


export const useUser = () => {
    
    const context = useContext(UserContext)

    if (context === undefined) {
        throw new Error ('The useUser must be used within a MyUserContextProvider')
    }

    return context
}
