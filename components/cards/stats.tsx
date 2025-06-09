import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Clock, Hash, DollarSign, TrendingUp } from "lucide-react";
import { StatsCardProps } from "../../lib/types/index";

export function StatsCard({ tokenStats, transactionData, className }: StatsCardProps) {
  const formattedBalance = tokenStats.balance / Math.pow(10, tokenStats.decimals);
  const isIncoming = transactionData?.type?.toLowerCase().includes('transfer') && 
                    transactionData?.details?.tokenTransfers?.[0]?.mint === tokenStats.mint;

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">
            {tokenStats.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {tokenStats.symbol}
          </CardDescription>
        </div>
        {transactionData && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "p-2 rounded-full",
              isIncoming ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            )}
          >
            {isIncoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
          </motion.div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold">{formattedBalance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Mint: {tokenStats.mint.slice(0, 4)}...{tokenStats.mint.slice(-4)}
              </p>
            </div>
            {tokenStats.price && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  {tokenStats.price.toLocaleString()}
                </div>
                {tokenStats.change24h && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    tokenStats.change24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    <TrendingUp className={cn(
                      "h-3 w-3",
                      tokenStats.change24h >= 0 ? "text-green-600" : "text-red-600 rotate-180"
                    )} />
                    {Math.abs(tokenStats.change24h).toFixed(2)}%
                  </div>
                )}
              </div>
            )}
          </div>

          {transactionData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 pt-4 border-t"
            >
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(transactionData.timestamp * 1000).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-xs">
                  {transactionData.signature.slice(0, 8)}...{transactionData.signature.slice(-8)}
                </span>
              </div>

              {transactionData.summary && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {transactionData.summary}
                  </p>
                </div>
              )}

              {transactionData.details && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    View Technical Details
                  </summary>
                  <pre className="mt-2 p-2 bg-muted rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(transactionData.details, null, 2)}
                  </pre>
                </details>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
