import { LiveTicker } from "@/components/LiveTicker";
import { Navbar } from "@/components/NavBar";
import { SpotlightBackground } from "@/components/SpotlightBackground";
import { EntrySplash } from "@/components/EntrySplash";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(sessionStorage.getItem('bidfair:entry-seen-v3')){document.documentElement.classList.add('entry-seen')}}catch(e){}",
        }}
      />
      <EntrySplash />
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
    </>
  );
}
