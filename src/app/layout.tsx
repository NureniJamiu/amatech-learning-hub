import type React from "react";
import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
                    <head>
                        <link rel="icon" href="/images/logo.png" type="image/png" />
                        <meta name="description" content="Amatech Learning Hub - Your gateway to modern learning, resources, and AI-powered assistance." />
                        <meta name="keywords" content="Amatech, Learning, Hub, Courses, AI, Education, Resources" />
                        <meta name="author" content="Amatech Team" />
                        <meta property="og:title" content="Amatech Learning Hub" />
                        <meta property="og:description" content="Your gateway to modern learning, resources, and AI-powered assistance." />
                        <meta property="og:image" content="/images/logo.png" />
                        <meta property="og:type" content="website" />
                        <meta property="og:url" content="https://amatech-learning-hub.com" />
                        <meta name="twitter:card" content="summary_large_image" />
                        <meta name="twitter:title" content="Amatech Learning Hub" />
                        <meta name="twitter:description" content="Your gateway to modern learning, resources, and AI-powered assistance." />
                        <meta name="twitter:image" content="/images/logo.png" />
                    </head>
            <body className={inter.className}>
                <QueryProvider>
                    {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
                    {children}
                    <ToastContainer
                        position="top-right"
                        autoClose={4000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                    {/* <Toaster /> */}
                    {/* </ThemeProvider> */}
                </QueryProvider>
            </body>
        </html>
    );
}
