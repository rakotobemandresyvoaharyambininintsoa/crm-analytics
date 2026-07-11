import { prisma } from "@/lib/prisma"; // ⚠️ Ajustez si nécessaire
import { BarChart3, Users, Receipt, Package, TrendingUp } from "lucide-react";

async function getKPIs() {
  const [
    nbClients,
    nbClientsActifs,
    opportunitesOuvertes,
    opportunitesGagnees,
    facturesPayees,
    facturesImpayees,
    produits,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.client.count({ where: { statut: "Client" } }),
    prisma.opportunite.findMany({ where: { statut: { notIn: ["Gagnée", "Perdue"] } } }),
    prisma.opportunite.findMany({ where: { statut: "Gagnée" } }),
    prisma.facture.findMany({ where: { statut: "Payée" } }),
    prisma.facture.count({ where: { statut: { notIn: ["Payée", "Annulée"] } } }),
    prisma.produit.findMany(),
  ]);

  const caEncaisse = facturesPayees.reduce((s, f) => s + f.montant, 0);
  const pipelineOuvert = opportunitesOuvertes.reduce((s, o) => s + o.montant, 0);

  const tauxConversion =
    opportunitesGagnees.length + opportunitesOuvertes.length > 0
      ? Math.round(
          (opportunitesGagnees.length /
            (opportunitesGagnees.length + opportunitesOuvertes.length)) *
            100
        )
      : 0;

  const valeurStock = produits.reduce((s, p) => s + p.prixAchat * p.quantite, 0);
  const produitsSousAlerte = produits.filter((p) => p.quantite <= p.seuilAlerte).length;

  return {
    nbClients,
    nbClientsActifs,
    caEncaisse,
    pipelineOuvert,
    tauxConversion,
    facturesImpayees,
    valeurStock,
    produitsSousAlerte,
    nbProduits: produits.length,
  };
}

function KPICard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3 text-white/40">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const kpi = await getKPIs();
  const formatMGA = (n: number) => `${n.toLocaleString("fr-FR")} MGA`;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Analytics</h1>
          <p className="text-sm text-white/40">Vue chiffrée de votre activité</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard icon={Users} label="Clients" value={String(kpi.nbClients)} sub={`${kpi.nbClientsActifs} clients actifs`} />
        <KPICard icon={TrendingUp} label="CA encaissé" value={formatMGA(kpi.caEncaisse)} />
        <KPICard icon={TrendingUp} label="Pipeline ouvert" value={formatMGA(kpi.pipelineOuvert)} sub={`Taux de conversion: ${kpi.tauxConversion}%`} />
        <KPICard icon={Receipt} label="Factures impayées" value={String(kpi.facturesImpayees)} />
        <KPICard icon={Package} label="Valeur du stock" value={formatMGA(kpi.valeurStock)} sub={`${kpi.nbProduits} références`} />
        <KPICard icon={Package} label="Produits sous seuil" value={String(kpi.produitsSousAlerte)} sub="Nécessitent un réapprovisionnement" />
      </div>

      <p className="text-xs text-white/30 mt-8">
        💡 Pour une analyse interprétée et des recommandations d'action, direction le{" "}
        <span className="text-violet-300">AI Command Center</span>.
      </p>
    </div>
  );
}
