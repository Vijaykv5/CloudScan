import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

interface UseWalletCheckProps {
  theme: "light" | "dark";
  onDisconnect?: () => void;
}

export const useWalletCheck = ({ theme, onDisconnect }: UseWalletCheckProps) => {
  const { connected } = useWallet();
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!connected && onDisconnect) {
      onDisconnect();
    }
  }, [connected, onDisconnect]);

  const checkWalletConnection = (): boolean => {
    if (!connected) {
      // If there's already a toast, don't show another one
      if (toastIdRef.current) {
        return false;
      }

      // Show new toast and store its ID
      toastIdRef.current = toast.error("Please connect your wallet to start chatting", {
        style: {
          background: theme === "dark" ? "#1e293b" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          border: "1px solid #0ea5e9",
        },
        duration: 3000, // Toast will disappear after 3 seconds
      });

      // Clear the toast ID after it disappears
      setTimeout(() => {
        toastIdRef.current = null;
      }, 3000);

      return false;
    }
    return true;
  };

  return {
    connected,
    checkWalletConnection,
  };
}; 