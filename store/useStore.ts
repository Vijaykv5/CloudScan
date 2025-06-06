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

interface ChatSession {
  id: string;
  messages: Message[];
  lastActive: number;
}

interface ChatState {
  activeChats: Record<string, ChatSession>; // Key is wallet address
  chatHistory: Record<string, ChatSession[]>; // Key is wallet address
  currentWallet: string | null;
  isLoading: boolean;
  setCurrentWallet: (wallet: string | null) => void;
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  clearActiveChat: () => void;
  moveToHistory: () => void;
  loadChatFromHistory: (chatId: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      activeChats: {},
      chatHistory: {},
      currentWallet: null,
      isLoading: false,

      setCurrentWallet: (wallet) => {
        set({ currentWallet: wallet });
      },

      addMessage: (message) => {
        const { currentWallet, activeChats } = get();
        if (!currentWallet) return;

        const newMessage = {
          ...message,
          timestamp: Date.now(),
        };

        const currentChat = activeChats[currentWallet] || {
          id: Date.now().toString(),
          messages: [],
          lastActive: Date.now(),
        };

        set({
          activeChats: {
            ...activeChats,
            [currentWallet]: {
              ...currentChat,
              messages: [...currentChat.messages, newMessage],
              lastActive: Date.now(),
            },
          },
        });
      },

      clearActiveChat: () => {
        const { currentWallet, activeChats } = get();
        if (!currentWallet) return;

        set({
          activeChats: {
            ...activeChats,
            [currentWallet]: {
              id: Date.now().toString(),
              messages: [],
              lastActive: Date.now(),
            },
          },
        });
      },

      moveToHistory: () => {
        const { currentWallet, activeChats, chatHistory } = get();
        if (!currentWallet || !activeChats[currentWallet]) return;

        const currentChat = activeChats[currentWallet];
        if (currentChat.messages.length === 0) return;

        set({
          chatHistory: {
            ...chatHistory,
            [currentWallet]: [
              ...(chatHistory[currentWallet] || []),
              currentChat,
            ],
          },
          activeChats: {
            ...activeChats,
            [currentWallet]: {
              id: Date.now().toString(),
              messages: [],
              lastActive: Date.now(),
            },
          },
        });
      },

      loadChatFromHistory: (chatId: string) => {
        const { currentWallet, chatHistory, activeChats } = get();
        if (!currentWallet || !chatHistory[currentWallet]) return;

        const chatToLoad = chatHistory[currentWallet].find(
          (chat) => chat.id === chatId
        );
        if (!chatToLoad) return;

        set({
          activeChats: {
            ...activeChats,
            [currentWallet]: {
              ...chatToLoad,
              lastActive: Date.now(),
            },
          },
        });
      },

      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        activeChats: state.activeChats,
        chatHistory: state.chatHistory,
        currentWallet: state.currentWallet,
      }),
    }
  )
); 