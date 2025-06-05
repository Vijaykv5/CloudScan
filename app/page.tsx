"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/ui/header";
import { ChatInterface } from "@/components/ui/chat-interface";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showTitle, setShowTitle] = useState(true);
  const { connected } = useWallet();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleFirstChat = () => {
    setShowTitle(false);
  };

  const handleDisconnect = () => {
    setShowTitle(true);
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center transition-colors duration-300",
        theme === "dark" ? "bg-slate-900" : ""
      )}
    >
      <div
        className="inset-0 z-0 fixed min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/cloud-background.png')`,
          opacity: theme === "dark" ? 0.3 : 1,
        }}
      />
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header theme={theme} onThemeToggle={toggleTheme} />

        <div className="flex flex-col items-center justify-center pt-36 pb-16">
          <AnimatePresence>
            {showTitle && (
              <motion.h1
                className={cn(
                  "text-3xl md:text-4xl font-bold text-center mb-8",
                  theme === "dark" ? "text-white" : "text-slate-800"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                Chat with your <span className="text-sky-500">Wallet</span> in
                seconds
              </motion.h1>
            )}
          </AnimatePresence>

          <div className="w-full max-w-xl mx-auto">
            <ChatInterface 
              theme={theme} 
              onFirstChat={handleFirstChat} 
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

