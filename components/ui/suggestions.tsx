import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SuggestionsProps {
  onSelect: (suggestion: string) => void;
  theme: 'light' | 'dark';
}

const SUGGESTIONS = [
  "Show the last 5 transactions list",
  "Give me the wallet balance",
  "Explore transfers I've made",
  "Show the dusty transfers",
];

export function Suggestions({ onSelect, theme }: SuggestionsProps) {
  return (
    <div className="w-full flex flex-col items-center gap-2 mt-2">
      {[0, 1].map(row => (
        <div key={row} className="flex flex-row justify-center gap-3 mb-1">
          {[0, 1].map(col => {
            const idx = row * 2 + col;
            const suggestion = SUGGESTIONS[idx];
            return (
              <motion.button
                key={suggestion}
                className={cn(
                  'py-1.5 px-4 rounded-full border border-slate-700 text-sm font-medium inline-flex items-center justify-center transition focus:outline-none',
                  'hover:bg-sky-900/80 hover:text-sky-200',
                  theme === 'dark'
                    ? 'bg-slate-800 text-white hover:border-sky-700'
                    : 'bg-white text-black hover:border-sky-400',
                  'whitespace-nowrap shadow-sm'
                )}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 200 }}
                onClick={() => onSelect(suggestion)}
              >
                {suggestion}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
