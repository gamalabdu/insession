import { create } from 'zustand'

interface BidModalStore {
    isOpen: boolean,
    onOpen: () => void;
    onClose: () => void;
}


const useBidModal = create<BidModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false})
}))


export default useBidModal