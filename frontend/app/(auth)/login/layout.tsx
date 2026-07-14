// app/(auth)/layout.tsx
// Coquille dédiée aux pages non authentifiées (login, futur mot de passe oublié...).
// Pas de Sidebar, pas de Header — juste un fond soigné derrière le formulaire.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Halo décoratif violet/bleu, purement esthétique */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
