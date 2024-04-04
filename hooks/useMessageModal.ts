import { create } from 'zustand'

interface MessageModalStore {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;
    otherUserName: string,
    setOtherUserName: (id: string) => void
    otherId: string
    setOtherId: (id: string) => void;

}


const useMessageModal = create<MessageModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    otherId :'',
    otherUserName: '',
    setOtherId: (id: string) => set({ otherId: id }),
    setOtherUserName : (id: string) => set ({otherUserName: id}), 
}))

export default useMessageModal