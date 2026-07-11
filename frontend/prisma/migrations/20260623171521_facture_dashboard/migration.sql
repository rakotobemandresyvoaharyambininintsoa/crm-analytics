/*
  Warnings:

  - You are about to drop the column `dateEmission` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `datePaiement` on the `Facture` table. All the data in the column will be lost.
  - You are about to alter the column `montant` on the `Facture` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `updatedAt` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT,
    "montant" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'En attente',
    "clientId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Facture" ("clientId", "createdAt", "id", "montant", "numero", "statut") SELECT "clientId", "createdAt", "id", "montant", "numero", "statut" FROM "Facture";
DROP TABLE "Facture";
ALTER TABLE "new_Facture" RENAME TO "Facture";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
