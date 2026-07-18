import { LiveTicker } from "@/components/LiveTicker";
import { Sidebar } from "@/components/Sidebar";
import { LiquidBackground } from "@/components/ui/liquid-background";
import { EntrySplash } from "@/components/EntrySplash";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EntrySplash />
      <LiquidBackground />
      <Sidebar />

      <div className="md:pl-60">
        <LiveTicker />
        <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10">{children}</main>
        <footer className="mt-16 border-t border-zinc-800/80 bg-black/40">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <p className="text-zinc-500">
              © {new Date().getFullYear()} BidFair · Fair allocations, no scalpers.
            </p>
            <div className="flex items-center gap-6 text-zinc-400">
              <a href="/events" className="transition-colors hover:text-zinc-100">Events</a>
              <a href="/arena" className="transition-colors hover:text-zinc-100">Arenas</a>
              <a href="/" className="transition-colors hover:text-zinc-100">How it works</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
