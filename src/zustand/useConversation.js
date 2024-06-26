import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    conversations: [], // Store list of conversations
    setConversations: (conversations) => set({ conversations }),
}));

export default useConversation;
 