-- CreateTable
CREATE TABLE "Parametre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomEntreprise" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "devise" TEXT NOT NULL DEFAULT 'Ar',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
