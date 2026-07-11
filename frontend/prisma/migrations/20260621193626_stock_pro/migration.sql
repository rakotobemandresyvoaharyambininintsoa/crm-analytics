/*
  Warnings:

  - You are about to drop the column `action` on the `Mouvement` table. All the data in the column will be lost.
  - You are about to drop the column `produit` on the `Mouvement` table. All the data in the column will be lost.
  - You are about to drop the column `prix` on the `Produit` table. All the data in the column will be lost.
  - Added the required column `produitId` to the `Mouvement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Mouvement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixAchat` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prixVente` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Produit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Inventaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produitId" INTEGER NOT NULL,
    "quantiteSysteme" INTEGER NOT NULL,
    "quantiteReelle" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "note" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventaire_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mouvement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produitId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "utilisateur" TEXT NOT NULL DEFAULT 'Admin',
    "commentaire" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mouvement_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mouvement" ("date", "id", "quantite") SELECT "date", "id", "quantite" FROM "Mouvement";
DROP TABLE "Mouvement";
ALTER TABLE "new_Mouvement" RENAME TO "Mouvement";
CREATE TABLE "new_Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "codeBarre" TEXT,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "marque" TEXT,
    "fournisseur" TEXT NOT NULL,
    "emplacement" TEXT,
    "prixAchat" INTEGER NOT NULL,
    "prixVente" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "seuilAlerte" INTEGER NOT NULL DEFAULT 10,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Produit" ("categorie", "createdAt", "fournisseur", "id", "nom", "quantite") SELECT "categorie", "createdAt", "fournisseur", "id", "nom", "quantite" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
CREATE UNIQUE INDEX "Produit_reference_key" ON "Produit"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
