/*
  Warnings:

  - You are about to drop the column `categorie` on the `Produit` table. All the data in the column will be lost.
  - You are about to drop the column `fournisseur` on the `Produit` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "FactureLigne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "factureId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix" REAL NOT NULL,
    CONSTRAINT "FactureLigne_factureId_fkey" FOREIGN KEY ("factureId") REFERENCES "Facture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FactureLigne_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opportunite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "clientId" INTEGER,
    "montant" REAL NOT NULL,
    "probabilite" INTEGER NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'Prospection',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Opportunite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Opportunite" ("clientId", "createdAt", "id", "montant", "nom", "statut") SELECT "clientId", "createdAt", "id", "montant", "nom", "statut" FROM "Opportunite";
DROP TABLE "Opportunite";
ALTER TABLE "new_Opportunite" RENAME TO "Opportunite";
CREATE TABLE "new_Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "codeBarre" TEXT,
    "nom" TEXT NOT NULL,
    "categorieId" INTEGER,
    "fournisseurId" INTEGER,
    "marque" TEXT,
    "emplacement" TEXT,
    "prixAchat" REAL NOT NULL DEFAULT 0,
    "prixVente" REAL NOT NULL DEFAULT 0,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "seuilAlerte" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Produit_fournisseurId_fkey" FOREIGN KEY ("fournisseurId") REFERENCES "Fournisseur" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Produit" ("codeBarre", "createdAt", "emplacement", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte", "updatedAt") SELECT "codeBarre", "createdAt", "emplacement", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte", "updatedAt" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
CREATE UNIQUE INDEX "Produit_reference_key" ON "Produit"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
