// Unlike layout.tsx, a template re-mounts on every navigation,
// so this replays the entrance animation for each page.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in-up flex flex-1 flex-col">{children}</div>;
}
