// Centralized type exports for components

// ai-response.tsx types
export interface BlockchainData {
  accountInfo?: {
    space: number;
    data: string;
    balance?: {
      sol: number;
      lamports: number;
    };
    owner?: string;
  } | null;
  balance?: number | null;
  transaction?: {
    type: string;
    timestamp: number;
    signature: string;
    summary?: string;
    [key: string]: unknown;
  } | null;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  blockchainData?: BlockchainData;
  error?: string;
}

export interface AIResponseProps {
  message: Message;
  isFirstMessage?: boolean;
}

// cards/stats.tsx types
export interface TokenStats {
  balance: number;
  symbol: string;
  name: string;
  decimals: number;
  mint: string;
  price?: number;
  change24h?: number;
}

export interface TransactionDetails {
  tokenTransfers?: Array<{
    mint: string;
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }>;
  [key: string]: unknown;
}

export interface TransactionData {
  type: string;
  timestamp: number;
  signature: string;
  summary?: string;
  details?: TransactionDetails;
}

export interface StatsCardProps {
  tokenStats: TokenStats;
  transactionData?: TransactionData;
  className?: string;
}

// response.tsx types (extends BlockchainData, TransactionDetails)
export interface BlockchainDataFull {
  accountInfo?: {
    balance: {
      sol: number;
      lamports: number;
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

export interface ResponseProps {
  response: string;
  blockchainData?: BlockchainDataFull;
  className?: string;
}

// providers/Wallet.tsx types
export type WalletProviderProps = {
  children?: React.ReactNode;
}; 