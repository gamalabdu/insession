import { create } from 'zustand';

interface ConversationData {
  mainUserPhoto: string;
  secondUserPhoto: string;
  mainUserName: string;
  secondUserName: string
}

interface ConversationStore {
  conversationData: ConversationData;
  setConversationData: (data: ConversationData) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({

  conversationData: {
    mainUserPhoto: '',
    secondUserPhoto: '',
    mainUserName: '',
    secondUserName: ''
  },

  setConversationData: (data: ConversationData) => set({ conversationData: data }),
  
}));
