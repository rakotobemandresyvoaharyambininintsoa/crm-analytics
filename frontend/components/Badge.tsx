export function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: "green" | "red" | "blue" | "gray" | "yellow";
}) {
  const colors = {
    green: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
    red: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
    blue: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
    gray: "bg-white/10 text-white/70 ring-1 ring-white/15",
    yellow: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${colors[color]}`}>
      {children}
    </span>
  );
}
