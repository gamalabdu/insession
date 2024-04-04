import { create } from 'zustand'

interface PostSessionModalStore {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;

}


const usePostSessionModal = create<PostSessionModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))

export default usePostSessionModal