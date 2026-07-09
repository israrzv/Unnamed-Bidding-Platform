import type { Metadata } from "next";
import "./globals.css";
import { LiveTicker } from "@/components/LiveTicker";
import { Navbar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "BidFair — Single-bid escrow ticketing",
  description:
    "A high-stakes, single-bid escrow ticketing platform for exclusive live events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LiveTicker />
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
