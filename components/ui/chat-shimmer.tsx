import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChatShimmerProps {
  theme: 'light' | 'dark';
}

export function ChatShimmer({ theme }: ChatShimmerProps) {
  const dots = Array.from({ length: 3 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'mb-4 p-4 rounded-lg max-w-[90%] mx-auto',
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      )}
    >
      <div className="flex items-center space-x-2">
        {dots.map((i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
            )}
            animate={{
              y: [0, -4, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
} 