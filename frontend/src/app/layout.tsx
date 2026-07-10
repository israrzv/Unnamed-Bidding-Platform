import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LiveTicker } from "@/components/LiveTicker";
import { Navbar } from "@/components/NavBar";
import { SpotlightBackground } from "@/components/SpotlightBackground";
import { IntroSplash } from "@/components/IntroSplash";

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
      <body className="bg-zinc-950 text-zinc-100">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('bidfair:intro-seen')){document.documentElement.classList.add('intro-seen')}}catch(e){}",
          }}
        />
        <IntroSplash />
        <SpotlightBackground />
        <LiveTicker />
        <Navbar />
        <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6">{children}</main>
        <footer className="mt-16 border-t-2 border-zinc-800/80 bg-zinc-900/40">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-zinc-500">
              © {new Date().getFullYear()} BidFair · Fair allocations, no scalpers.
            </p>
            <div className="flex items-center gap-6 text-zinc-400">
              <a href="/events" className="transition-colors hover:text-zinc-100">Events</a>
              <a href="/profile" className="transition-colors hover:text-zinc-100">Vault</a>
              <a href="/" className="transition-colors hover:text-zinc-100">How it works</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
