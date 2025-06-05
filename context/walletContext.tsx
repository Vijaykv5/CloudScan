import React, { createContext, useContext, useEffect } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useStore } from "@/store/useStore";

interface WalletContextType {
  isWalletConnected: boolean;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({
  children,
}) => {
  const { connected, publicKey } = useSolanaWallet();
  const { setCurrentWallet } = useStore();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    if (connected && publicKey) {
      setCurrentWallet(publicKey.toString());
    } else {
      setCurrentWallet(null);
    }
    setLoading(false);
  }, [connected, publicKey, setCurrentWallet]);

  return (
    <WalletContext.Provider
      value={{ isWalletConnected: connected, loading }}
    >
      {children}
    </WalletContext.Provider>
  );
};
