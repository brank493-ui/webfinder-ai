import { create } from 'zustand';
import type { AppState, Business, ChatMessage } from '@/types';

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  searchResults: [],
  isSearching: false,
  searchError: null,
  websiteFilter: 'all',
  categoryFilter: '',
  selectedBusiness: null,
  isChatOpen: false,
  conversation: [],
  isAiTyping: false,
  selectedPackage: null,

  // Actions
  setSearchResults: (results: Business[]) => set({ searchResults: results }),

  setIsSearching: (isSearching: boolean) => set({ isSearching }),

  setSearchError: (error: string | null) => set({ searchError: error }),

  setWebsiteFilter: (filter: 'all' | 'no_website' | 'has_website') =>
    set({ websiteFilter: filter }),

  setCategoryFilter: (category: string) => set({ categoryFilter: category }),

  setSelectedBusiness: (business: Business | null) =>
    set({ selectedBusiness: business, isChatOpen: business !== null }),

  setIsChatOpen: (isOpen: boolean) => set({ isChatOpen: isOpen }),

  addMessage: (message: ChatMessage) =>
    set((state) => ({ conversation: [...state.conversation, message] })),

  setConversation: (messages: ChatMessage[]) => set({ conversation: messages }),

  setIsAiTyping: (isTyping: boolean) => set({ isAiTyping: isTyping }),

  setSelectedPackage: (pkg: 'standard' | 'pro' | 'premium' | null) =>
    set({ selectedPackage: pkg }),

  clearConversation: () =>
    set({ conversation: [], selectedBusiness: null, isChatOpen: false }),
}));
