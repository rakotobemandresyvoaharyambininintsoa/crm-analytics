-- CreateTable
CREATE TABLE "Entrepot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "adresse" TEXT
);

-- CreateTable
CREATE TABLE "InventaireSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "reference" TEXT,
    "date" DATETIME NOT NULL,
    "heure" TEXT,
    "entrepotId" INTEGER,
    "zone" TEXT,
    "responsableId" INTEGER,
    "equipe" TEXT,
    "commentaire" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "doubleComptage" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "valideLe" DATETIME,
    "valideParId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InventaireSession_entrepotId_fkey" FOREIGN KEY ("entrepotId") REFERENCES "Entrepot" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventaireSession_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventaireSession_valideParId_fkey" FOREIGN KEY ("valideParId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventaireLigne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "stockSysteme" INTEGER NOT NULL,
    "stockCompte1" INTEGER,
    "stockCompte2" INTEGER,
    "stockCompte" INTEGER,
    "ecart" INTEGER,
    "valeurEcart" REAL,
    "commentaire" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InventaireLigne_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InventaireSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventaireLigne_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventaireComptage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ligneId" INTEGER NOT NULL,
    "numero" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "compteParId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventaireComptage_ligneId_fkey" FOREIGN KEY ("ligneId") REFERENCES "InventaireLigne" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InventaireComptage_compteParId_fkey" FOREIGN KEY ("compteParId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventaireAjustement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "produitId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "ancienStock" INTEGER NOT NULL,
    "nouveauStock" INTEGER NOT NULL,
    "motif" TEXT,
    "responsableId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventaireAjustement_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InventaireSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventaireAjustement_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventaireAjustement_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventaireAudit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER,
    "utilisateurId" INTEGER,
    "action" TEXT NOT NULL,
    "ancienneValeur" TEXT,
    "nouvelleValeur" TEXT,
    "adresseIp" TEXT,
    "justification" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventaireAudit_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InventaireSession" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "InventaireAudit_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InventaireParametres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "frequence" TEXT NOT NULL DEFAULT 'Mensuelle',
    "doubleComptage" BOOLEAN NOT NULL DEFAULT true,
    "toleranceEcart" REAL NOT NULL DEFAULT 2,
    "validationObligatoire" BOOLEAN NOT NULL DEFAULT true,
    "signatureObligatoire" BOOLEAN NOT NULL DEFAULT true,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "rappelsAutomatiques" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InventaireSession_reference_key" ON "InventaireSession"("reference");
