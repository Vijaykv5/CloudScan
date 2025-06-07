import { motion } from "framer-motion";
import { Clock, Hash, ArrowUpRight, ArrowDownLeft, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockchainData {
  accountInfo?: {
    balance: {
      lamports: number;
      sol: number;
    };
    owner: string;
    executable: boolean;
    rentEpoch: number;
    space: number;
    data: string;
  };
  balance?: number;
  transaction?: {
    type: string;
    timestamp: number;
    signature: string;
    summary?: string;
    details?: any;
  };
}

interface ResponseProps {
  response: string;
  blockchainData?: BlockchainData;
  className?: string;
}

export function Response({ response, blockchainData, className }: ResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* AI Response */}
      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">{response}</p>
      </div>

      {/* Blockchain Data */}
      {blockchainData && (
        <div className="space-y-4">
          {/* Account Info */}
          {blockchainData.accountInfo && (
            <div className="p-4 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium mb-2">Account Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="font-medium">{blockchainData.accountInfo.balance.sol} SOL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Owner</span>
                  <span className="font-mono text-xs">
                    {blockchainData.accountInfo.owner.slice(0, 4)}...{blockchainData.accountInfo.owner.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Space</span>
                  <span className="text-sm">{blockchainData.accountInfo.space} bytes</span>
                </div>
              </div>
            </div>
          )}

          {/* Token Balance */}
          {blockchainData.balance !== undefined && (
            <div className="p-4 bg-card rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium mb-2">Token Balance</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-medium">{blockchainData.balance} SOL</span>
              </div>
            </div>
          )}

          {/* Transaction Info */}
          {blockchainData.transaction && (
            <div className="p-4 bg-card rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Transaction Details</h3>
                <div className={cn(
                  "p-2 rounded-full",
                  blockchainData.transaction.type.toLowerCase().includes('transfer') 
                    ? "bg-green-100 text-green-600" 
                    : "bg-blue-100 text-blue-600"
                )}>
                  {blockchainData.transaction.type.toLowerCase().includes('transfer') 
                    ? <ArrowDownLeft className="h-4 w-4" /> 
                    : <ArrowUpRight className="h-4 w-4" />}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(blockchainData.transaction.timestamp * 1000).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-xs">
                    {blockchainData.transaction.signature.slice(0, 8)}...{blockchainData.transaction.signature.slice(-8)}
                  </span>
                </div>

                {blockchainData.transaction.summary && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {blockchainData.transaction.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
} 