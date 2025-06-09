import { motion } from "framer-motion";
import { Bot, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWalletCheck } from "@/hooks/useWalletCheck";
import { ReactNode } from "react";

interface SearchBarProps {
  theme: "light" | "dark";
  searchValue: string;
  isInputFocused: boolean;
  onSearchChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
  buttonIcon?: ReactNode;
  buttonText?: string;
  onRandomIdeaClick?: () => void;
}

export function SearchBar({
  theme,
  searchValue,
  isInputFocused,
  onSearchChange,
  onFocusChange,
  buttonIcon,
  buttonText = "Random Chat",
  onRandomIdeaClick
}: SearchBarProps) {
  const { connected, checkWalletConnection } = useWalletCheck({ 
    theme,
    onDisconnect: () => {
      onSearchChange(""); // Clear the input field whenever the wallet gots disconnects
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkWalletConnection()) {
      return;
    }
    onSearchChange(e.target.value);
  };

  const handleRandomChat = () => {
    if (!checkWalletConnection()) {
      return;
    }
    if (onRandomIdeaClick) onRandomIdeaClick();
  };

  return (
    <motion.div
      className="w-full max-w-xl mx-auto relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div
        className={cn(
          "flex items-center bg-white overflow-hidden transition-all duration-300 shadow-sm",
          isInputFocused ? "shadow-lg ring-2 ring-sky-200 " : "rounded-3xl",
          theme === "dark" ? "bg-slate-800" : "bg-white"
        )}
        animate={{
          borderRadius: isInputFocused ? "0.75rem" : "1rem",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{
            scale: isInputFocused ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Bot
            className={cn(
              "h-5 w-5 ml-4",
              theme === "dark" ? "text-sky-400" : "text-sky-500"
            )}
          />
        </motion.div>
        <Input
          type="text"
          placeholder={connected ? "what do you want to know about solana..." : "Connect wallet to start chatting..."}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const form = e.currentTarget.closest('form');
              if (form) {
                form.requestSubmit();
              }
            }
          }}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-2",
            theme === "dark"
              ? "bg-slate-800 text-white placeholder:text-slate-400"
              : "text-black placeholder:text-gray-500"
          )}
        />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "mr-2 rounded-full hover:bg-sky-50",
            theme === "dark" ? "hover:bg-slate-700" : ""
          )}
          onClick={handleRandomChat}
        >
          {buttonIcon || <Lightbulb className="h-4 w-4 mr-1 text-sky-500" />}
          <span className={theme === "dark" ? "text-white" : ""}>
            {buttonText}
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
} 