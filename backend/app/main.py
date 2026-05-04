from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import auth_routes, product_routes, traceability_routes, public_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meat Traceability System",
    description="QR based meat supply chain traceability system with JWT, RBAC, audit log and mock blockchain",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(product_routes.router)
app.include_router(traceability_routes.router)
app.include_router(public_routes.router)

@app.get("/")
def root():
    return {
        "message": "Traceability API is running",
        "docs": "http://127.0.0.1:8000/docs",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
    }