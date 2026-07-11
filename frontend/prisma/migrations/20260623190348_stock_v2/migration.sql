/*
  Warnings:

  - You are about to drop the column `date` on the `Mouvement` table. All the data in the column will be lost.
  - You are about to drop the column `utilisateur` on the `Mouvement` table. All the data in the column will be lost.
  - You are about to alter the column `prixAchat` on the `Produit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `prixVente` on the `Produit` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `updatedAt` to the `Produit` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mouvement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produitId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "commentaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Mouvement_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Mouvement" ("commentaire", "id", "produitId", "quantite", "type") SELECT "commentaire", "id", "produitId", "quantite", "type" FROM "Mouvement";
DROP TABLE "Mouvement";
ALTER TABLE "new_Mouvement" RENAME TO "Mouvement";
CREATE TABLE "new_Produit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "codeBarre" TEXT,
    "nom" TEXT NOT NULL,
    "categorie" TEXT,
    "marque" TEXT,
    "fournisseur" TEXT,
    "emplacement" TEXT,
    "prixAchat" REAL NOT NULL DEFAULT 0,
    "prixVente" REAL NOT NULL DEFAULT 0,
    "quantite" INTEGER NOT NULL DEFAULT 0,
    "seuilAlerte" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Produit" ("categorie", "codeBarre", "createdAt", "emplacement", "fournisseur", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte") SELECT "categorie", "codeBarre", "createdAt", "emplacement", "fournisseur", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
CREATE UNIQUE INDEX "Produit_reference_key" ON "Produit"("reference");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
