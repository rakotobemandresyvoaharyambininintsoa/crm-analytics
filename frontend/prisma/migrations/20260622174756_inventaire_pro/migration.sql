/*
  Warnings:

  - You are about to drop the column `difference` on the `Inventaire` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Inventaire` table. All the data in the column will be lost.
  - You are about to drop the column `quantiteReelle` on the `Inventaire` table. All the data in the column will be lost.
  - You are about to drop the column `quantiteSysteme` on the `Inventaire` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Produit` table. All the data in the column will be lost.
  - Added the required column `ecart` to the `Inventaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockReel` to the `Inventaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockSysteme` to the `Inventaire` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "produitId" INTEGER NOT NULL,
    "stockSysteme" INTEGER NOT NULL,
    "stockReel" INTEGER NOT NULL,
    "ecart" INTEGER NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventaire_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Inventaire" ("date", "id", "produitId") SELECT "date", "id", "produitId" FROM "Inventaire";
DROP TABLE "Inventaire";
ALTER TABLE "new_Inventaire" RENAME TO "Inventaire";
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
    "quantite" INTEGER NOT NULL,
    "seuilAlerte" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Produit" ("categorie", "codeBarre", "createdAt", "emplacement", "fournisseur", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte") SELECT "categorie", "codeBarre", "createdAt", "emplacement", "fournisseur", "id", "marque", "nom", "prixAchat", "prixVente", "quantite", "reference", "seuilAlerte" FROM "Produit";
DROP TABLE "Produit";
ALTER TABLE "new_Produit" RENAME TO "Produit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
