import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletCheck } from "@/hooks/useWalletCheck";

function getDateLabel(timestamp: number) {
  const now = new Date();
  const date = new Date(timestamp);
  const isYesterday =
    now.getDate() - date.getDate() === 1 &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear();
  return isYesterday ? "Yesterday" : undefined;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  dateLabel?: string;
  lastActive: number;
}

export function Sidebar({ theme, children }: { theme: "light" | "dark"; children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { publicKey } = useWallet();
  const { connected } = useWalletCheck({ theme });
  const { chatHistory, loadChatFromHistory } = useStore();
  const walletKey = publicKey?.toString();

  // Get chat history for current wallet
  const historyItems: ChatHistoryItem[] = walletKey && chatHistory[walletKey]
    ? chatHistory[walletKey]
        .map(chat => ({
          id: chat.id,
          title: chat.messages[0]?.content || 'Empty Chat',
          dateLabel: getDateLabel(chat.lastActive),
          lastActive: chat.lastActive,
        }))
        .sort((a, b) => b.lastActive - a.lastActive)
    : [];

  const handleChatSelect = (chatId: string) => {
    loadChatFromHistory(chatId);
    setIsOpen(false);
  };

  if (!connected) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 h-full z-40",
        isOpen ? "w-64" : "w-12"
      )}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isOpen ? (
        <motion.div
          className={cn(
            "h-full backdrop-blur-md",
            "w-12",
            theme === "dark" ? "bg-slate-800/10" : "bg-white/10"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className={cn(
            "h-full backdrop-blur-md",
            "w-64",
            theme === "dark" ? "bg-slate-800/10" : "bg-white/10"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 px-2 overflow-y-auto">
            {walletKey && historyItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold px-2 mb-2">Chat History</h3>
                {historyItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left",
                      theme === "dark" ? "hover:bg-slate-700" : "hover:bg-slate-100"
                    )}
                    onClick={() => handleChatSelect(item.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm truncate w-full">{item.title}</span>
                      {item.dateLabel && (
                        <span className="text-xs text-gray-500">{item.dateLabel}</span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 