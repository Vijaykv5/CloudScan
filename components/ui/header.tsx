import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@/components/providers/styles/wallet-adapter.css";
import { X } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  const { connected, disconnect, publicKey } = useWallet();
  console.log(connected, publicKey);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="flex justify-end items-center py-4 px-4 [font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open_Sans','Helvetica_Neue',sans-serif]">
      <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="ml-4 relative"
      >
        {connected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDisconnect}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white hover:bg-red-100 hover:text-red-600 shadow-sm z-10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        <WalletMultiButton />
      </motion.div>
    </div>
  );
} 