"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/ui/header";
import { SearchBar } from "@/components/ui/search-bar";
import { ActionButtons } from "@/components/ui/action-buttons";

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchValue, setSearchValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center transition-colors duration-300",
        theme === "dark" ? "bg-slate-900" : ""
      )}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/cloud-background.png')`,
          opacity: theme === "dark" ? 0.3 : 1,
        }}
      />
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header theme={theme} onThemeToggle={toggleTheme} />

        <div className="flex flex-col items-center justify-center pt-20 pb-16">
          <motion.h1
            className={cn(
              "text-3xl md:text-4xl font-bold text-center mb-12",
              theme === "dark" ? "text-white" : "text-slate-800"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Chat with your <span className="text-sky-500">wallet</span> in
            seconds
          </motion.h1>

          <SearchBar
            theme={theme}
            searchValue={searchValue}
            isInputFocused={isInputFocused}
            onSearchChange={setSearchValue}
            onFocusChange={setIsInputFocused}
          />

          <ActionButtons theme={theme} />
        </div>
      </div>
    </div>
  );
}

