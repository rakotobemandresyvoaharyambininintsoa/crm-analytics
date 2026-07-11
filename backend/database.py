import sys
import os
import sqlite3

ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ROOT)

DB_PATH = os.path.join(ROOT, "crm.db")


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # ================= USERS =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password_hash TEXT,
        role TEXT CHECK(role IN ('admin','sales','viewer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ================= CLIENTS =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        email TEXT UNIQUE COLLATE NOCASE,
        telephone TEXT,
        entreprise TEXT,
        ville TEXT,
        secteur TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ================= PROSPECTS =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prospects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        email TEXT UNIQUE COLLATE NOCASE,
        telephone TEXT,
        entreprise TEXT,
        statut TEXT CHECK(statut IN ('Lead','Contacté','Proposition','Négociation','Gagné','Perdu')),
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ================= VENTES =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ventes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        montant REAL,
        date_vente TEXT,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
    """)

    # ================= OPPORTUNITES =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS opportunites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        titre TEXT,
        montant REAL,
        probabilite INTEGER,
        statut TEXT CHECK(statut IN ('Lead','Won','Lost')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
    """)

    # ================= ACTIVITES =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        type_activite TEXT,
        description TEXT,
        date_activite TEXT,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
    """)

    # ================= FACTURES =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS factures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        numero TEXT,
        montant REAL,
        statut TEXT CHECK(statut IN ('payée','non_payée')),
        date_facture TEXT,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    )
    """)

    # ================= PIPELINE HISTORY =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pipeline_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prospect_id INTEGER,
        old_status TEXT,
        new_status TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (prospect_id) REFERENCES prospects(id) ON DELETE CASCADE
    )
    """)

    # ================= AUDIT LOGS =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        action TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ================= NOTIFICATIONS =================
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT,
        statut TEXT DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # ================= INDEX (IMPORTANT PERF) =================
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_prospects_email ON prospects(email)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_ventes_client ON ventes(client_id)")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("CRM Database PRO créée avec succès")

# ================= DASHBOARD =================


def get_dashboard_stats():

    conn = get_connection()

    cursor = conn.cursor()



    # CLIENTS

    cursor.execute("""
        SELECT COUNT(*)
        FROM clients
    """)

    clients = cursor.fetchone()[0]




    # PROSPECTS

    cursor.execute("""
        SELECT COUNT(*)
        FROM prospects
    """)

    prospects = cursor.fetchone()[0]





    # VENTES

    cursor.execute("""
        SELECT COALESCE(SUM(montant),0)
        FROM ventes
    """)

    ventes = cursor.fetchone()[0]





    # OPPORTUNITES

    cursor.execute("""
        SELECT COUNT(*)
        FROM opportunites
    """)

    opportunites = cursor.fetchone()[0]





    conn.close()



    return {

        "clients": clients,

        "prospects": prospects,

        "ventes": ventes,

        "opportunites": opportunites

    }