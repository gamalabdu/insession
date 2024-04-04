import { create } from 'zustand'

interface ProfileSetupModalStore {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;

}


const useProfileSetupModal = create<ProfileSetupModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default useProfileSetupModal