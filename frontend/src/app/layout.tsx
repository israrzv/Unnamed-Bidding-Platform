import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "BidFair — Fair allocations for live events",
  description:
    "A single-pledge, escrow-backed allocation platform using a Vickrey uniform-price model.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sans.variable}`}>
      <body className="bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}
