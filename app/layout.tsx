import type React from "react";
import "@/app/globals.css";
import { Mali } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const mali = Mali({ 
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata = {
  title: "Cloud Project Creator",
  description: "Create your cloud project in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className={mali.className}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
