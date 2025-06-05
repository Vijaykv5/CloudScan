import { motion } from "framer-motion";
import { Layers, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  theme: "light" | "dark";
  delay: number;
}

function ActionButton({ icon, label, theme, delay }: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Button
        variant="outline"
        className={cn(
          "rounded-full px-5 py-2 h-auto border",
          theme === "dark"
            ? "bg-slate-800/70 text-white border-slate-700 hover:bg-slate-700"
            : "bg-white/80 backdrop-blur-sm hover:bg-white"
        )}
      >
        {icon}
        {label}
      </Button>
    </motion.div>
  );
}

interface ActionButtonsProps {
  theme: "light" | "dark";
}

export function ActionButtons({ theme }: ActionButtonsProps) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
    </motion.div>
  );
} 