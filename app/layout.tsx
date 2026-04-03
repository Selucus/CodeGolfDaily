import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

const siteUrl = "https://code-golf-daily.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CodeGolfDaily - Daily Code Golf Puzzles",
  description:
    "Solve a new code golf challenge every day. Write the shortest code possible in JavaScript or Python. Free, no account needed.",
  keywords: [
    "code golf",
    "daily puzzle",
    "programming challenge",
    "javascript",
    "python",
    "coding game",
    "wordle for programmers",
    "shortest code",
    "daily coding challenge",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "CodeGolfDaily - Daily Code Golf Puzzles",
    description:
      "A new code golf challenge every day. How short can your code be?",
    type: "website",
    siteName: "CodeGolfDaily",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeGolfDaily - Daily Code Golf Puzzles",
    description:
      "A new code golf challenge every day. How short can your code be?",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CodeGolfDaily",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
