import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/ui/search-bar';
import { Send, Lightbulb } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useWallet } from '@solana/wallet-adapter-react';
import { AIResponse } from '@/components/ai-response';
import { Suggestions } from '@/components/ui/suggestions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  blockchainData?: any;
  error?: string;
}

interface ChatInterfaceProps {
  theme: 'light' | 'dark';
  onFirstChat?: () => void;
  onDisconnect?: () => void;
}

export function ChatInterface({ theme, onFirstChat, onDisconnect }: ChatInterfaceProps) {
  const { publicKey, connected } = useWallet();
  const { 
    activeChats, 
    currentWallet, 
    isLoading, 
    setCurrentWallet, 
    addMessage, 
    setIsLoading, 
    clearActiveChat,
    moveToHistory 
  } = useStore();
  
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = currentWallet && activeChats[currentWallet] 
    ? activeChats[currentWallet].messages 
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentMessages.length > 0 && currentMessages[currentMessages.length - 1].role === 'assistant') {
      scrollToBottom();
    }
  }, [currentMessages]);

  useEffect(() => {
    if (publicKey && connected) {
      setCurrentWallet(publicKey.toString());
    } else {
      setCurrentWallet(null);
      setIsInitialState(true);
      setInput('');
      clearActiveChat(); // Clear active chat immediately
      onDisconnect?.();
    }
  }, [publicKey, connected, setCurrentWallet, clearActiveChat, onDisconnect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentWallet) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ role: 'user', content: userMessage });
    
    if (isInitialState) {
      setIsInitialState(false);
      onFirstChat?.();
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to process request');
      }

      addMessage({
        role: 'assistant',
        content: data.response,
        blockchainData: data.blockchainData
      });
    } catch (error) {
      console.error('Error:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setShowSuggestions(false);
    setInput(suggestion);
    setTimeout(() => {
      // Submit the suggestion as a chat message
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      {isInitialState || !connected ? (
        <div className="flex-1 flex items-start justify-center pt-4">
          <AnimatePresence>
            {showInput && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-2xl mx-auto"
              >
                <form onSubmit={handleSubmit}>
                  <SearchBar
                    theme={theme}
                    searchValue={input}
                    isInputFocused={isInputFocused}
                    onSearchChange={setInput}
                    onFocusChange={setIsInputFocused}
                    buttonIcon={<Lightbulb className="h-4 w-4 mr-1 text-sky-500" />}
                    buttonText={connected ? "Random Idea" : "Connect Wallet to Start"}
                    onRandomIdeaClick={() => setShowSuggestions(true)}
                  />
                </form>
                {showSuggestions && (
                  <Suggestions
                    onSelect={handleSuggestionSelect}
                    theme={theme}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <>
          <div className="flex-1 flex flex-col pb-48 overflow-y-auto pt-24">
            <AnimatePresence>
              {currentMessages.map((message, index) => (
                <AIResponse
                  key={message.timestamp}
                  message={message}
                  isFirstMessage={index === 0}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <motion.div 
            className="fixed bottom-0 left-0 right-0 py-4"
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-2xl mx-auto px-4"
                >
                  <form onSubmit={handleSubmit}>
                    <SearchBar
                      theme={theme}
                      searchValue={input}
                      isInputFocused={isInputFocused}
                      onSearchChange={setInput}
                      onFocusChange={setIsInputFocused}
                      buttonIcon={isLoading ? null : <Send className="h-4 w-4 mr-1 text-sky-500" />}
                      buttonText={isLoading ? "Processing..." : "Send"}
                    />
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
} 