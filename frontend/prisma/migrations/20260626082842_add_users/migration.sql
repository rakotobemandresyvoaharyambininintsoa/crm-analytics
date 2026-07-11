/*
  Warnings:

  - You are about to drop the `Parametre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `dateEcheance` on the `Opportunite` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Opportunite` table. All the data in the column will be lost.
  - You are about to drop the column `probabilite` on the `Opportunite` table. All the data in the column will be lost.
  - You are about to drop the column `titre` on the `Opportunite` table. All the data in the column will be lost.
  - You are about to alter the column `montant` on the `Opportunite` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `nom` to the `Opportunite` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Parametre";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "clientId" INTEGER,
    "opportuniteId" INTEGER,
    "montant" REAL NOT NULL,
    "tva" REAL NOT NULL DEFAULT 20,
    "remise" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'Brouillon',
    "dateEcheance" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Facture_opportuniteId_fkey" FOREIGN KEY ("opportuniteId") REFERENCES "Opportunite" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Facture" ("clientId", "createdAt", "dateEcheance", "id", "montant", "numero", "remise", "statut", "tva", "updatedAt") SELECT "clientId", "createdAt", "dateEcheance", "id", "montant", "numero", "remise", "statut", "tva", "updatedAt" FROM "Facture";
DROP TABLE "Facture";
ALTER TABLE "new_Facture" RENAME TO "Facture";
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");
CREATE TABLE "new_Opportunite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "clientId" INTEGER,
    "montant" REAL NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'Prospect',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Opportunite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Opportunite" ("clientId", "createdAt", "id", "montant", "statut") SELECT "clientId", "createdAt", "id", "montant", "statut" FROM "Opportunite";
DROP TABLE "Opportunite";
ALTER TABLE "new_Opportunite" RENAME TO "Opportunite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
