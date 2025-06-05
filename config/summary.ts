import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function generateTransactionSummary(transactionData: {
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
