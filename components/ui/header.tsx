import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <div className="flex justify-end py-4 [font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open_Sans','Helvetica_Neue',sans-serif]">
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button variant="ghost" className="ml-2">
          Connect Wallet
        </Button>
      </motion.div>
    </div>
  );
} 