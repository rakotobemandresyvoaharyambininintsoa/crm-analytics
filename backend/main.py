from fastapi import FastAPI

from backend.routes import (
    Clients,
    Prospects,
    Ventes,
    Opportunites,
    Activites,
    Factures,
    Rapports
)

app = FastAPI(title="CRM SaaS Pro")

app.include_router(Clients.router)
app.include_router( Prospects.router)
app.include_router(Ventes.router)
app.include_router(Opportunites.router)
app.include_router(Activites.router)
app.include_router( Factures.router)
app.include_router( Rapports.router)


@app.get("/")
def home():
    return {"status": "CRM SaaS READY 🚀"}