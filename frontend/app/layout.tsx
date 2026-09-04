import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jtc.sjis.edu.bd"),
  title: {
    default: "SJIS Inter-School Tech Carnival 2026 | Josephite Tech Club",
    template: "%s | JTC 2026 — St. Joseph International School",
  },
  description:
    "Official registration portal for SJIS Inter-School Tech Carnival 2026 organized by Josephite Tech Club at St. Joseph International School, Dhaka. Compete across 18 arenas in Coding, AI Prompting, Autonomous Robotics, Drone Flight, E-Sports, and Creative Media.",
  applicationName: "JTC 2026 Carnival Portal",
  authors: [
    { name: "Josephite Tech Club", url: "https://jtc.sjis.edu.bd" },
    { name: "St. Joseph International School", url: "https://sjis.edu.bd" },
  ],
  generator: "Next.js",
  keywords: [
    "SJIS Tech Carnival 2026",
    "Josephite Tech Club",
    "St. Joseph International School",
    "JTC 2026",
    "SJIS Carnival",
    "Inter School Tech Carnival Dhaka",
    "School Tech Fest Bangladesh",
    "Coding Marathon Dhaka",
    "Competitive Programming School Bangladesh",
    "AI Prompting Competition Bangladesh",
    "Drone Competition Bangladesh",
    "Robo Showcase Dhaka",
    "Line Follower Robot SJIS",
    "Tech Olympiad Dhaka",
    "Inter School Hackathon Bangladesh",
    "Digital Art Banner Competition",
    "Speed Typing Competition Dhaka",
    "Photography Exhibition School Fest",
    "Tech Quiz Bangladesh",
    "St Joseph Mohammadpur Dhaka Tech Club",
  ],
  creator: "Josephite Tech Club",
  publisher: "St. Joseph International School",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://jtc.sjis.edu.bd",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jtc.sjis.edu.bd",
    siteName: "Josephite Tech Club — SJIS",
    title: "SJIS Inter-School Tech Carnival 2026 | Josephite Tech Club",
    description:
      "Join Bangladesh's premier school tech festival at St. Joseph International School. 18 competitive arenas, gold crests, medals, prize money, and e-certificates.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "SJIS Inter-School Tech Carnival 2026 Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SJIS Inter-School Tech Carnival 2026 | Josephite Tech Club",
    description:
      "Compete in AI, Coding, Robotics, Drone Flight, E-Sports, and Multimedia at St. Joseph International School, Dhaka.",
    images: ["/og-preview.png"],
    creator: "@sjis_dhaka",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Technology",
};

// ─── JSON-LD Structured Data for Google Rich Snippets ─────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "@id": "https://jtc.sjis.edu.bd/#event",
      name: "SJIS Inter-School Tech Carnival 2026",
      alternateName: "JTC Tech Carnival 2026",
      description:
        "The flagship inter-school technology festival hosted by Josephite Tech Club featuring 18 competitive arenas across AI, Programming, Robotics, Drone Design, and E-Sports.",
      startDate: "2026-10-01T08:30:00+06:00",
      endDate: "2026-10-02T18:00:00+06:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "St. Joseph International School",
        address: {
          "@type": "PostalAddress",
          streetAddress: "97 Asad Avenue, Mohammadpur",
          addressLocality: "Dhaka",
          postalCode: "1207",
          addressCountry: "BD",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "23.7588",
          longitude: "90.3622",
        },
      },
      organizer: {
        "@type": "Organization",
        name: "Josephite Tech Club",
        url: "https://jtc.sjis.edu.bd",
      },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "BDT",
        lowPrice: "200",
        highPrice: "1000",
        offerCount: "18",
        url: "https://jtc.sjis.edu.bd/register",
        availability: "https://schema.org/InStock",
      },
      image: ["https://jtc.sjis.edu.bd/og-preview.png"],
    },
    {
      "@type": "EducationalOrganization",
      "@id": "https://sjis.edu.bd/#organization",
      name: "St. Joseph International School",
      url: "https://sjis.edu.bd",
      logo: "https://jtc.sjis.edu.bd/favicon.ico",
      address: {
        "@type": "PostalAddress",
        streetAddress: "97 Asad Avenue, Mohammadpur",
        addressLocality: "Dhaka",
        postalCode: "1207",
        addressCountry: "BD",
      },
      sameAs: [
        "https://www.facebook.com",
        "https://www.instagram.com",
        "https://www.youtube.com",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://jtc.sjis.edu.bd/#website",
      url: "https://jtc.sjis.edu.bd",
      name: "Josephite Tech Club Carnival 2026",
      publisher: {
        "@id": "https://sjis.edu.bd/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://jtc.sjis.edu.bd/events?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
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

