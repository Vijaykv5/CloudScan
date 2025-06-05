import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@/components/providers/styles/wallet-adapter.css";
import { X } from "lucide-react";
import Image from "next/image";
import logo from "@/public/images/logo.png";

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
    <div className="flex justify-between items-center py-4 px-4 [font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open_Sans','Helvetica_Neue',sans-serif]">
      <div className="flex items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              x: [0, 2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="relative">
              <Image 
                src={logo} 
                alt="CloudScan Logo" 
                width={120} 
                height={120} 
                className="mr-4 select-none pointer-events-none" 
                priority 
                draggable={false}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-200/20 to-blue-200/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
          <motion.div
            className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-200/20 rounded-full blur-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>
      </div>
      <div className="flex items-center">
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
    </div>
  );
} 