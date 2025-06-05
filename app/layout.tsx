import type React from "react";
import "@/app/globals.css";
import { Mali } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Wallet } from "@/components/providers/Wallet";
import { Toaster } from "react-hot-toast";

const mali = Mali({ 
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Cloudscan",
  description: "Know more about your wallet in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Wallet>
            <div className={mali.className}>
              {children}
            </div>
            <Toaster position="bottom-right" />
          </Wallet>
        </ThemeProvider>
      </body>
    </html>
  );
}
