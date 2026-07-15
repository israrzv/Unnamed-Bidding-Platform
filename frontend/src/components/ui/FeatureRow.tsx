import { ShieldCheck, Fingerprint, Lock, Users } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "Fair Allocation", body: "No bots. No scalpers. Just real fans." },
  { icon: Fingerprint, title: "Verified Fans Only", body: "One person. One allocation." },
  { icon: Lock, title: "Transparent System", body: "Real-time updates. No hidden rules." },
  { icon: Users, title: "Fan First", body: "Built for the community, by the community." },
];

/** Trust strip shown near the bottom of the main pages. */
export function FeatureRow() {
  return (
    <div className="grid gap-6 border-t border-zinc-800/80 py-8 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, body }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-0.5 text-sm text-zinc-500">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
