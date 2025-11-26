import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pandora's Box - Jewelry Portfolio Tracker",
  description: "Track and manage your gold jewelry collection. Monitor current values, investment performance, and manage your precious jewelry portfolio with real-time gold price tracking across multiple currencies.",
  keywords: ["jewelry tracker", "gold portfolio", "jewelry management", "gold value tracker", "investment tracker", "precious metals"],
  authors: [{ name: "Pandora's Box" }],
  openGraph: {
    title: "Pandora's Box - Jewelry Portfolio Tracker",
    description: "Track and manage your gold jewelry collection with real-time value monitoring",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="pandoras-box-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
