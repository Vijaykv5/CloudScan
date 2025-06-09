import { motion } from "framer-motion";
import { Clock, Hash, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponseProps } from "../lib/types/index";

export function Response({ response, blockchainData, className, theme }: ResponseProps & { theme?: 'light' | 'dark' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-4", className)}
    >
      {/* AI Response */}
      <div className={cn(
        "p-4 rounded-lg",
        theme === 'dark' ? 'bg-slate-800' : 'bg-muted'
      )}>
        <p className={cn(
          "text-sm",
          theme === 'dark' ? 'text-slate-200' : 'text-muted-foreground'
        )}>{response}</p>
      </div>

      {/* Blockchain Data */}
      {blockchainData && (
        <div className="space-y-4">
          {/* Account Info */}
          {blockchainData.accountInfo && (
            <div className={cn(
              "p-4 rounded-lg border shadow-sm",
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-card'
            )}>
              <h3 className={cn(
                "text-sm font-medium mb-2",
                theme === 'dark' ? 'text-slate-200' : 'text-foreground'
              )}>Account Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                  )}>Balance</span>
                  <span className={cn(
                    "font-medium",
                    theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                  )}>{blockchainData.accountInfo.balance.sol} SOL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                  )}>Owner</span>
                  <span className={cn(
                    "font-mono text-xs",
                    theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                  )}>
                    {blockchainData.accountInfo.owner.slice(0, 4)}...{blockchainData.accountInfo.owner.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                  )}>Space</span>
                  <span className={cn(
                    "text-sm",
                    theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                  )}>{blockchainData.accountInfo.space} bytes</span>
                </div>
              </div>
            </div>
          )}

          {/* Token Balance */}
          {blockchainData.balance !== undefined && (
            <div className={cn(
              "p-4 rounded-lg border shadow-sm",
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-card'
            )}>
              <h3 className={cn(
                "text-sm font-medium mb-2",
                theme === 'dark' ? 'text-slate-200' : 'text-foreground'
              )}>Token Balance</h3>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-sm",
                  theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                )}>Balance</span>
                <span className={cn(
                  "font-medium",
                  theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                )}>{blockchainData.balance.toFixed(4)} SOL</span>
              </div>
            </div>
          )}

          {/* Transaction Info */}
          {blockchainData.transaction && (
            <div className={cn(
              "p-4 rounded-lg border shadow-sm",
              theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-card'
            )}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                )}>Transaction Details</h3>
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
                  <Clock className={cn(
                    "h-4 w-4",
                    theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                  )}>{new Date(blockchainData.transaction.timestamp * 1000).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Hash className={cn(
                    "h-4 w-4",
                    theme === 'dark' ? 'text-slate-400' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    "font-mono text-xs",
                    theme === 'dark' ? 'text-slate-200' : 'text-foreground'
                  )}>
                    {blockchainData.transaction.signature.slice(0, 8)}...{blockchainData.transaction.signature.slice(-8)}
                  </span>
                </div>

                {blockchainData.transaction.summary && (
                  <div className={cn(
                    "mt-2 p-3 rounded-lg",
                    theme === 'dark' ? 'bg-slate-700' : 'bg-muted'
                  )}>
                    <p className={cn(
                      "text-sm",
                      theme === 'dark' ? 'text-slate-200' : 'text-muted-foreground'
                    )}>
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