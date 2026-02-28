import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebFinder - Discover Businesses Without Websites",
  description: "AI-powered platform to discover local businesses without websites, connect with them through AI conversations, and help them establish their digital presence.",
  keywords: ["WebFinder", "AI", "Business Discovery", "Website Development", "Local SEO", "Small Business"],
  authors: [{ name: "WebFinder Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "WebFinder - Business Discovery Platform",
    description: "Help businesses grow online with AI-powered discovery and website development",
    url: "https://webfinder.ai",
    siteName: "WebFinder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WebFinder",
    description: "AI-powered business discovery and website development platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
