import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Response } from "./response";
import { AIResponseProps } from "../lib/types/index";

export function AIResponse({ message, isFirstMessage, theme }: AIResponseProps & { theme?: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'mb-4 p-4 rounded-lg',
        message.role === 'user'
          ? 'bg-sky-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
        isFirstMessage ? 'max-w-3xl mx-auto' : 'max-w-[90%] mx-auto'
      )}
    >
      {message.role === 'user' ? (
        <p className={cn(
          "text-sm",
          isFirstMessage ? "text-base" : ""
        )}>
          {message.content}
        </p>
      ) : (
        <Response 
          response={message.content}
          theme={theme}
        />
      )}
      
      {message.error && (
        <p className="mt-2 text-sm text-red-500">
          Error: {message.error}
        </p>
      )}
    </motion.div>
  );
} 