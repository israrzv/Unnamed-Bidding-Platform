// A template re-mounts on every navigation (unlike layout), so the slide-in
// animation replays each time the route changes.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
