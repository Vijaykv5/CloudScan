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
    
    const prompt = `Analyze this Solana transaction and provide a natural, conversational summary in 2-3 sentences. Focus on what the transaction means for the user:

    Type: ${transactionData.type}
    Timestamp: ${new Date(transactionData.timestamp * 1000).toLocaleString()}
    Signature: ${transactionData.signature}
    ${transactionData.details ? `Details: ${JSON.stringify(transactionData.details)}` : ''}
    
    Guidelines:
    - Use natural, conversational language
    - Explain what the transaction means in practical terms
    - Focus on the impact or purpose of the transaction
    - Avoid technical jargon unless necessary
    - Keep it concise but informative`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating transaction summary:', error);
    return `Transaction of type ${transactionData.type} processed at ${new Date(transactionData.timestamp * 1000).toLocaleString()}.`;
  }
}
