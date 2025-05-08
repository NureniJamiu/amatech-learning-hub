import type React from "react";
import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";

// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amatech Lasu - Student Learning Hub",
  description: "Access course materials and resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
          {children}
          {/* <Toaster /> */}
          {/* </ThemeProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}
