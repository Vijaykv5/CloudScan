import { motion } from "framer-motion";
import { Search, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  theme: "light" | "dark";
  searchValue: string;
  isInputFocused: boolean;
  onSearchChange: (value: string) => void;
  onFocusChange: (focused: boolean) => void;
}

export function SearchBar({
  theme,
  searchValue,
  isInputFocused,
  onSearchChange,
  onFocusChange,
}: SearchBarProps) {
  return (
    <motion.div
      className="w-full max-w-xl mx-auto relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div
        className={cn(
          "flex items-center bg-white rounded-full overflow-hidden transition-all duration-300 shadow-sm",
          isInputFocused ? "shadow-lg ring-2 ring-sky-200" : "",
          theme === "dark" ? "bg-slate-800" : "bg-white"
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 ml-4",
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          )}
        />
        <Input
          type="text"
          placeholder="Describe your cloud project idea..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
          className={cn(
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 py-6 px-2",
            theme === "dark"
              ? "bg-slate-800 text-white placeholder:text-slate-400"
              : ""
          )}
        />
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "mr-2 rounded-full hover:bg-sky-50",
            theme === "dark" ? "hover:bg-slate-700" : ""
          )}
        >
          <Lightbulb className="h-4 w-4 mr-1 text-sky-500" />
          <span className={theme === "dark" ? "text-white" : ""}>
            Random Idea
          </span>
        </Button>
      </div>
    </motion.div>
  );
} 