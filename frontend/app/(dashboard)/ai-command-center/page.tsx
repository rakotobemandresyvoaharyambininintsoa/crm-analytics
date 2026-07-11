"use client";

import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  AlertTriangle,
  AlertCircle,
  Info,
  Send,
  Loader2,
  Sparkles,
  Mail,
  UserSearch,
  X,
  Copy,
  Check,
} from "lucide-react";

type Insight = {
  id: string;
  categorie: "client" | "opportunite" | "facture" | "stock" | "correlation";
  severite: "info" | "attention" | "critique";
  titre: string;
  message: string;
  actionSuggeree?: string;
  actionType?: "relance-facture" | "diagnostic-client";
  actionData?: { factureId?: number; clientId?: number };
};

type Message = { role: "user" | "assistant"; content: string };

const SEVERITE_STYLE: Record<Insight["severite"], { border: string; badge: string; icon: typeof Info }> = {
  critique: { border: "border-red-500/30", badge: "bg-red-500/10 text-red-300 ring-red-500/20", icon: AlertCircle },
  attention: { border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-300 ring-amber-500/20", icon: AlertTriangle },
  info: { border: "border-blue-500/30", badge: "bg-blue-500/10 text-blue-300 ring-blue-500/20", icon: Info },
};

const CATEGORIE_LABEL: Record<Insight["categorie"], string> = {
  client: "Client",
  opportunite: "Opportunité",
  facture: "Facture",
  stock: "Stock",
  correlation: "Pattern détecté",
};

export default function AICommandCenterPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [synthese, setSynthese] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [panneauOuvert, setPanneauOuvert] = useState(false);
  const [panneauTitre, setPanneauTitre] = useState("");
  const [panneauContenu, setPanneauContenu] = useState("");
  const [panneauChargement, setPanneauChargement] = useState(false);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    fetch("/api/ai/insights")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setInsights(data.insights);
        setSynthese(data.synthese);
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setLoadingInsights(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function envoyerQuestion() {
    const q = question.trim();
    if (!q || loadingChat) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.error ?? data.reponse }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erreur de connexion. Réessayez." }]);
    } finally {
      setLoadingChat(false);
    }
  }

  async function declencherAction(insight: Insight) {
    if (!insight.actionType || !insight.actionData) return;

    setPanneauOuvert(true);
    setPanneauChargement(true);
    setPanneauContenu("");
    setCopie(false);

    try {
      if (insight.actionType === "relance-facture" && insight.actionData.factureId) {
        setPanneauTitre("Email de relance généré par l'IA");
        const res = await fetch("/api/ai/actions/relance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ factureId: insight.actionData.factureId }),
        });
        const data = await res.json();
        setPanneauContenu(data.error ?? data.email);
      } else if (insight.actionType === "diagnostic-client" && insight.actionData.clientId) {
        setPanneauTitre("Diagnostic IA du client");
        const res = await fetch("/api/ai/actions/diagnostic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: insight.actionData.clientId }),
        });
        const data = await res.json();
        setPanneauContenu(data.error ?? data.diagnostic);
      }
    } catch {
      setPanneauContenu("Erreur lors de la génération. Réessayez.");
    } finally {
      setPanneauChargement(false);
    }
  }

  function copierContenu() {
    navigator.clipboard.writeText(panneauContenu);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  const insightsCorrelation = insights.filter((i) => i.categorie === "correlation");
  const insightsStandard = insights.filter((i) => i.categorie !== "correlation");

  return (
    <div className="max-w-5xl mx-auto text-white relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Command Center</h1>
          <p className="text-sm text-white/40">Analyse proactive de votre activité, en continu</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.07] to-blue-500/[0.04] p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-violet-300/70 mb-2">
          Synthèse IA du jour
        </p>
        {loadingInsights ? (
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyse des données en cours...
          </div>
        ) : erreur ? (
          <p className="text-sm text-red-300">{erreur}</p>
        ) : (
          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{synthese}</p>
        )}
      </div>

      {insightsCorrelation.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/[0.08] to-violet-500/[0.05] p-5 relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-500/20 shrink-0">
              <Sparkles className="h-5 w-5 text-fuchsia-300" />
            </div>
            <div>
              <span className="inline-flex items-center rounded-full ring-1 ring-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-fuchsia-300 mb-2">
                Insight avancé
              </span>
              <h3 className="text-sm font-semibold mb-1">{insightsCorrelation[0].titre}</h3>
              <p className="text-sm text-white/70">{insightsCorrelation[0].message}</p>
              {insightsCorrelation[0].actionSuggeree && (
                <p className="text-xs text-fuchsia-300/90 mt-2">→ {insightsCorrelation[0].actionSuggeree}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-white/30 mb-3 px-1">
          Alertes détectées ({insightsStandard.length})
        </p>
        {!loadingInsights && insightsStandard.length === 0 && !erreur && (
          <p className="text-sm text-white/40 px-1">Aucune alerte — tout est sous contrôle.</p>
        )}
        <div className="space-y-3">
          {insightsStandard.map((insight) => {
            const style = SEVERITE_STYLE[insight.severite];
            const Icon = style.icon;
            return (
              <div
                key={insight.id}
                className={`rounded-xl border ${style.border} bg-white/[0.03] p-4 flex items-start gap-3`}
              >
                <Icon className="h-5 w-5 mt-0.5 shrink-0 opacity-80" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center rounded-full ring-1 px-2 py-0.5 text-[10px] font-semibold uppercase ${style.badge}`}>
                      {CATEGORIE_LABEL[insight.categorie]}
                    </span>
                    <h3 className="text-sm font-semibold">{insight.titre}</h3>
                  </div>
                  <p className="text-sm text-white/60">{insight.message}</p>

                  {insight.actionType ? (
                    <button
                      onClick={() => declencherAction(insight)}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 ring-1 ring-violet-500/30 px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors"
                    >
                      {insight.actionType === "relance-facture" ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : (
                        <UserSearch className="h-3.5 w-3.5" />
                      )}
                      {insight.actionSuggeree}
                    </button>
                  ) : (
                    insight.actionSuggeree && (
                      <p className="text-xs text-violet-300/80 mt-1.5">→ {insight.actionSuggeree}</p>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <p className="text-sm font-semibold">Interroger vos données</p>
          <p className="text-xs text-white/40">Ex: "Quels clients n'ont pas commandé depuis 2 mois ?"</p>
        </div>

        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-xs text-white/30 italic">Posez votre première question ci-dessous.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white"
                    : "bg-white/[0.06] text-white/80"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loadingChat && (
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Réflexion en cours...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/10 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && envoyerQuestion()}
            placeholder="Posez une question sur vos clients, ventes, stock..."
            className="flex-1 rounded-xl bg-white/[0.05] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
          <button
            onClick={envoyerQuestion}
            disabled={loadingChat || !question.trim()}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-white disabled:opacity-40 shadow-lg shadow-violet-500/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      {panneauOuvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                {panneauTitre}
              </h3>
              <button
                onClick={() => setPanneauOuvert(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 max-h-96 overflow-y-auto">
              {panneauChargement ? (
                <div className="flex items-center gap-2 text-white/50 text-sm py-6 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération en cours...
                </div>
              ) : (
                <p className="text-sm text-white/80 whitespace-pre-line">{panneauContenu}</p>
              )}
            </div>

            {!panneauChargement && panneauContenu && (
              <button
                onClick={copierContenu}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 ring-1 ring-violet-500/30 px-4 py-2.5 text-sm font-medium text-violet-300 transition-colors"
              >
                {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copie ? "Copié !" : "Copier le texte"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
