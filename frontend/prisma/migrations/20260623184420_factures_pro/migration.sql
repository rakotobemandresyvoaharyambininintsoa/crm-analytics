/*
  Warnings:

  - Made the column `numero` on table `Facture` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Facture" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "clientId" INTEGER,
    "montant" REAL NOT NULL,
    "tva" REAL NOT NULL DEFAULT 20,
    "remise" REAL NOT NULL DEFAULT 0,
    "statut" TEXT NOT NULL DEFAULT 'Brouillon',
    "dateEcheance" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Facture_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Facture" ("clientId", "createdAt", "id", "montant", "numero", "statut", "updatedAt") SELECT "clientId", "createdAt", "id", "montant", "numero", "statut", "updatedAt" FROM "Facture";
DROP TABLE "Facture";
ALTER TABLE "new_Facture" RENAME TO "Facture";
CREATE UNIQUE INDEX "Facture_numero_key" ON "Facture"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
