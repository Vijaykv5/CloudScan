import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Connection, PublicKey } from '@solana/web3.js';
import { Helius } from 'helius-sdk';
import type { EnrichedTransaction } from 'helius-sdk';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

// Initialize Solana connection with Helius RPC
const connection = new Connection(process.env.HELIUS_RPC_URL || '');

// Initialize Helius client
const helius = new Helius(process.env.HELIUS_API_KEY || '', 'mainnet-beta');

// Helper function to get account info
async function getAccountInfo(address: string) {
  try {
    const pubKey = new PublicKey(address);
    const accountInfo = await connection.getAccountInfo(pubKey);
    
    if (!accountInfo) {
      return null;
    }

    return {
      balance: {
        lamports: accountInfo.lamports,
        sol: accountInfo.lamports / 1e9 // Convert lamports to SOL
      },
      owner: accountInfo.owner.toBase58(),
      executable: accountInfo.executable,
      rentEpoch: accountInfo.rentEpoch,
      space: accountInfo.data.length,
      data: accountInfo.data.length > 0 ? 'Contains data' : 'No data'
    };
  } catch (error) {
    console.error('Error fetching account info:', error);
    return null;
  }
}

// Helper function to get token balance
async function getTokenBalance(address: string) {
  try {
    const pubKey = new PublicKey(address);
    const balance = await connection.getBalance(pubKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return null;
  }
}

// Helper function to get transaction details using Helius
async function getTransactionDetails(signature: string) {
  try {
    const result = await helius.parseTransactions({
      transactions: [signature],
    });
    
    if (!result || !result[0]) {
      console.error('Helius API returned no transaction data');
      return null;
    }

    const parsedTransaction: EnrichedTransaction = result[0];
    return parsedTransaction;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return null;
  }
}

// Helper function to generate transaction summary using Gemini
async function generateTransactionSummary(transactionData: {
  type: string;
  timestamp: number;
  signature: string;
  details?: any;
}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `Analyze this Solana transaction and provide a concise summary in maximum 3 sentences:
    Type: ${transactionData.type}
    Timestamp: ${new Date(transactionData.timestamp * 1000).toLocaleString()}
    Signature: ${transactionData.signature}
    ${transactionData.details ? `Details: ${JSON.stringify(transactionData.details)}` : ''}
    
    Focus on the most important aspects and keep the summary clear and informative.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating transaction summary:', error);
    return `Transaction of type ${transactionData.type} processed at ${new Date(transactionData.timestamp * 1000).toLocaleString()}.`;
  }
}

export async function POST(req: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }
    if (!process.env.HELIUS_RPC_URL) {
      throw new Error('HELIUS_RPC_URL is not set in environment variables');
    }
    if (!process.env.HELIUS_API_KEY) {
      throw new Error('HELIUS_API_KEY is not set in environment variables');
    }

    const { message } = await req.json();
    
    if (!message) {
      throw new Error('No message provided in request');
    }

    console.log('Processing message:', message);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create chat session with proper parts array structure and enhanced instructions
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a friendly and knowledgeable Solana blockchain assistant. Your goal is to help users understand and interact with the Solana ecosystem in a natural, conversational way.

          When discussing Solana-related topics:
          - Use natural, conversational language
          - Explain technical concepts in simple terms
          - Focus on practical, real-world applications
          - Avoid showing raw data unless specifically requested
          - Keep responses concise and engaging
          
          For account queries, include ACCOUNT_INFO.
          For balance queries, include TOKEN_BALANCE.
          For transaction queries, include TRANSACTION_INFO.
          
          When including account information, use this format:
          ACCOUNT_INFO: Address: <address>
          
          When including balance information, use this format:
          TOKEN_BALANCE: Address: <address>
          
          When including transaction information, use this format:
          TRANSACTION_INFO: Signature: <signature>
          
          Always respond in a human-friendly way, incorporating the blockchain data into your response naturally.
          If you need to fetch blockchain data, include the relevant markers in your response.` }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll help users explore the Solana blockchain in a friendly, conversational way, making complex concepts easy to understand while keeping the focus on practical applications." }],
        },
      ],
    });

    // Get response from Gemini
    const result = await chat.sendMessage(message);
    const aiResponse = result.response.text();

    console.log('Gemini response:', aiResponse);

    // Extract blockchain data requirements from AI response
    let blockchainData = {};
    
    if (aiResponse?.includes('ACCOUNT_INFO')) {
      const addressMatch = aiResponse.match(/Address: ([A-Za-z0-9]+)/);
      if (addressMatch) {
        const accountInfo = await getAccountInfo(addressMatch[1]);
        blockchainData = { ...blockchainData, accountInfo };
      }
    }

    if (aiResponse?.includes('TOKEN_BALANCE')) {
      const addressMatch = aiResponse.match(/Address: ([A-Za-z0-9]+)/);
      if (addressMatch) {
        const balance = await getTokenBalance(addressMatch[1]);
        blockchainData = { ...blockchainData, balance };
      }
    }

    if (aiResponse?.includes('TRANSACTION_INFO')) {
      const signatureMatch = aiResponse.match(/Signature: ([A-Za-z0-9]+)/);
      if (signatureMatch) {
        const transaction = await getTransactionDetails(signatureMatch[1]);
        if (transaction) {
          const summary = await generateTransactionSummary({
            type: transaction.type || 'Unknown',
            timestamp: transaction.timestamp,
            signature: signatureMatch[1],
            details: transaction
          });
          blockchainData = { 
            ...blockchainData, 
            transaction: {
              ...transaction,
              summary
            }
          };
        }
      }
    }

    // Clean up the AI response by removing the data fetching instructions
    const cleanResponse = aiResponse
      ?.replace(/ACCOUNT_INFO:.*$/gm, '')
      .replace(/TOKEN_BALANCE:.*$/gm, '')
      .replace(/TRANSACTION_INFO:.*$/gm, '')
      .trim();

    return NextResponse.json({
      response: cleanResponse,
      blockchainData
    });

  } catch (error) {
    console.error('Detailed error in chat route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
