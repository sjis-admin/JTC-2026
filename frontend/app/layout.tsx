import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import MobileStickyBar from "@/components/common/MobileStickyBar";
import Providers from "@/components/common/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Josephite Tech Club | SJIS Inter-School Tech Carnival 2026",
  description: "Official registration and portal for SJIS Inter-School Tech Carnival 2026 organized by Josephite Tech Club at St. Joseph International School.",
  keywords: "SJIS, Josephite Tech Club, JTC, Tech Carnival, Coding Marathon, AI Prompting, Robotics, Drone, E-Sports",
  openGraph: {
    title: "SJIS Inter-School Tech Carnival 2026 — Josephite Tech Club",
    description: "Participate in 19 thrilling technology, AI, coding, robotics, and esports events.",
    url: "https://jtc.sjis.edu.bd",
    siteName: "Josephite Tech Club",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col bg-background text-[#F0F6FF] cyber-grid antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileStickyBar />
        </Providers>
      </body>
    </html>
  );
}
