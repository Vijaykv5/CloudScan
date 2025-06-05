import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PublicKey } from '@solana/web3.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  blockchainData?: any;
  error?: string;
  timestamp: number;
}

interface ChatState {
  messages: Record<string, Message[]>; // Key is wallet address
  currentWallet: string | null;
  isLoading: boolean;
  setCurrentWallet: (wallet: string | null) => void;
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  clearMessages: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {},
      currentWallet: null,
      isLoading: false,
      setCurrentWallet: (wallet) => {
        set({ currentWallet: wallet });
      },
      addMessage: (message) => {
        const { currentWallet, messages } = get();
        if (!currentWallet) return;

        const newMessage = {
          ...message,
          timestamp: Date.now(),
        };

        set({
          messages: {
            ...messages,
            [currentWallet]: [...(messages[currentWallet] || []), newMessage],
          },
        });
      },
      clearMessages: () => {
        const { currentWallet, messages } = get();
        if (!currentWallet) return;

        set({
          messages: {
            ...messages,
            [currentWallet]: [],
          },
        });
      },
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        messages: state.messages,
        currentWallet: state.currentWallet,
      }),
    }
  )
); 