import pandas as pd

def export_clients(conn):
    df = pd.read_sql(
        "SELECT * FROM clients",
        conn
    )

    df.to_excel(
        "exports/clients.xlsx",
        index=False
    )