"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [afficherMdp, setAfficherMdp] = useState(false);

  async function connexion(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!email.trim() || !password) {
      setErreur("Merci de renseigner ton email et ton mot de passe");
      return;
    }

    setChargement(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.error || "Erreur connexion");
        setChargement(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setErreur("Impossible de contacter le serveur");
      setChargement(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20 mb-4">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Connexion CRM
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Accédez à votre espace de travail
          </p>
        </div>

        <form
          onSubmit={connexion}
          className="bg-white/[0.03] border border-white/10 p-8 rounded-xl"
        >
          {erreur && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {erreur}
            </div>
          )}

          <div className="space-y-3 mb-5">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="bg-white/[0.03] border border-white/10 p-3 pl-11 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="password"
                  name="password"
                  type={afficherMdp ? "text" : "password"}
                  autoComplete="current-password"
                  className="bg-white/[0.03] border border-white/10 p-3 pl-11 pr-11 rounded-lg w-full text-sm placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-colors"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  tabIndex={-1}
                >
                  {afficherMdp ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={chargement}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 p-3 rounded-lg w-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chargement ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {chargement ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
