import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Resilience Wall — Gujarat disaster management stories",
  description:
    "A living wall of first-hand disaster management experiences from across Gujarat. Every note carries its own hashtag.",
  applicationName: "Resilience Wall",
  keywords: [
    "Gujarat",
    "disaster management",
    "resilience",
    "community stories",
    "climate adaptation",
  ],
  openGraph: {
    title: "Resilience Wall — Gujarat disaster management stories",
    description:
      "First-hand field notes from the people preparing, responding and rebuilding across Gujarat.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
