import { NextResponse, NextRequest } from "next/server";
import type { EnrichedTransaction } from "helius-sdk";
import { Helius } from "helius-sdk";
import { generateTransactionSummary } from "@/config/summary";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const signature = searchParams.get("signature");
  const summary = searchParams.get("summary") === "true";
  
  console.log("signature", signature);

  if (!signature) {
    return NextResponse.json(
      { error: "Signature is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    console.error("Helius API key is not configured.");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const helius = new Helius(process.env.HELIUS_API_KEY || "");
    const result = await helius.parseTransactions({
      transactions: [signature],
    });
    if (!result) {
      console.error(
        "Helius API returned an error in the JSON response:",
        result
      );
      return NextResponse.json(
        { error: "Helius API returned an error", details: result },
        { status: 500 }
      );
    }

    const parsedTransaction: EnrichedTransaction = result[0];

    if (!parsedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found or not yet parsed" },
        { status: 404 }
      );
    }

    // If summary is requested, generate AI summary
    if (summary) {
      const summaryText = await generateTransactionSummary({
        type: parsedTransaction.type || 'Unknown',
        timestamp: parsedTransaction.timestamp,
        signature: signature,
        details: parsedTransaction
      });

      return NextResponse.json({
        summary: summaryText,
        signature: signature,
        timestamp: parsedTransaction.timestamp,
        type: parsedTransaction.type
      });
    }

    // Return full transaction details if summary not requested
    return NextResponse.json(parsedTransaction);
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Internal server error fetching transaction details",
          details: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error fetching transaction details" },
      { status: 500 }
    );
  }
} 