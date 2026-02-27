"""
MedAI FastAPI Application Entry Point.
Handles startup events, middleware, route registration, and Swagger UI config.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.core.config import settings
from app.api.routes import auth, medical
from app.ai.rag_engine import build_index
from app.ai.meditron_client import check_ollama_running
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("medai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs on startup and shutdown"""
    # ── STARTUP ───────────────────────────────────────────────
    logger.info("🚀 Starting MedAI...")
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables ready")
    
    # Check Meditron is running
    if check_ollama_running():
        logger.info("✅ Ollama/Meditron is running")
    else:
        logger.warning("⚠️  Ollama not detected at localhost:11434 — run: ollama serve")
    
    # Build RAG index if not built yet
    logger.info("🔢 Building RAG knowledge index...")
    count = build_index()
    logger.info(f"✅ RAG index: {count} chunks ready")
    
    yield  # App runs here
    
    # ── SHUTDOWN ──────────────────────────────────────────────
    logger.info("👋 Shutting down MedAI...")


app = FastAPI(
    title="MedAI API",
    description="AI-Powered Medical Information System — Meditron 70B + RAG",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,    prefix="/api")
app.include_router(medical.router, prefix="/api")

@app.get("/health")
async def health():
    ollama_ok = check_ollama_running()
    return {
        "status": "ok" if ollama_ok else "degraded",
        "meditron": "running" if ollama_ok else "offline",
        "app": settings.APP_NAME,
        "version": "1.0.0"
    }
