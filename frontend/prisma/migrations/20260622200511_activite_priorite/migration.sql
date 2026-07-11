-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'A faire',
    "priorite" TEXT NOT NULL DEFAULT 'Normale',
    "clientId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Activite" ("clientId", "createdAt", "date", "description", "id", "statut", "titre", "type") SELECT "clientId", "createdAt", "date", "description", "id", "statut", "titre", "type" FROM "Activite";
DROP TABLE "Activite";
ALTER TABLE "new_Activite" RENAME TO "Activite";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
