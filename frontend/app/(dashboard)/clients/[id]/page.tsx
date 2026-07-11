"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";

import ClientStats from "@/components/clients/ClientStats";
import ClientToolbar from "@/components/clients/ClientToolbar";
import ClientForm from "@/components/clients/ClientForm";
import ClientTable from "@/components/clients/ClientTable";

export default function Clients() {
  const router = useRouter();

  const [clients, setClients] = useState<any[]>([]);
  const [recherche, setRecherche] = useState("");
  const [form, setForm] = useState({
    nom: "",
    entreprise: "",
    email: "",
    telephone: "",
    ville: "",
    pays: "",
  });

  useEffect(() => {
    charger();
  }, []);

  async function charger() {
    const res = await fetch("/api/clients");
    setClients(await res.json());
  }

  function changer(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function ajouter() {
    await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      nom: "",
      entreprise: "",
      email: "",
      telephone: "",
      ville: "",
      pays: "",
    });

    charger();
  }

  async function supprimer(id: number) {
    await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });

    charger();
  }

  const liste = clients.filter((c) =>
    c.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Clients
            </h1>
            <p className="text-sm text-white/40">
              Gérez votre portefeuille clients
            </p>
          </div>
        </div>

        <ClientStats clients={clients} />

        <ClientToolbar
          recherche={recherche}
          setRecherche={setRecherche}
          ouvrir={() => {}}
        />

        <ClientForm form={form} changer={changer} ajouter={ajouter} />

        <ClientTable
          clients={liste}
          supprimer={supprimer}
          voir={(id: number) => router.push("/clients/" + id)}
        />
      </div>
    </div>
  );
}
