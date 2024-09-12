import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SolanaProvider } from "@/contexts/WalletProvider";
import { CookiesProvider } from 'next-client-cookies/server';
import { AuthProvider } from "@/contexts/AuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana marketpalce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <SolanaProvider>
            <CookiesProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </CookiesProvider>
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
