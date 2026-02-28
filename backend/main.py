"""
MedAI FastAPI Application Entry Point.
Handles startup events, middleware, route registration, and Swagger UI config.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager
from app.core.database import engine, Base
from app.core.config import settings
from app.api.routes import auth, medical
from app.ai.rag_engine import build_index
from app.ai.meditron_client import check_ollama_running
import logging
import os

# Create logs directory if it doesn't exist
os.makedirs("logs", exist_ok=True)

# Configure logging with UTF-8 encoding for console
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Console handler with UTF-8 encoding
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)
# Force UTF-8 encoding on Windows
if hasattr(console_handler.stream, 'reconfigure'):
    console_handler.stream.reconfigure(encoding='utf-8')

# File handler for app logs
file_handler = logging.FileHandler('logs/app.log', encoding='utf-8')
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(console_formatter)

# Remove default handlers and add our configured ones
root_logger = logging.getLogger()
root_logger.handlers.clear()
root_logger.addHandler(console_handler)
root_logger.addHandler(file_handler)

# Suppress SQLAlchemy verbose logging - send only to file
sqlalchemy_logger = logging.getLogger("sqlalchemy.engine")
sqlalchemy_logger.setLevel(logging.WARNING)
sqlalchemy_logger.propagate = False
sqlalchemy_file_handler = logging.FileHandler('logs/database.log', encoding='utf-8')
sqlalchemy_file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
sqlalchemy_logger.addHandler(sqlalchemy_file_handler)

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

# Custom OpenAPI schema with security scheme
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="MedAI API",
        version="1.0.0",
        description="AI-Powered Medical Information System — Meditron 70B + RAG",
        routes=app.routes,
    )
    
    # Add security scheme for Bearer token
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "JWT Bearer token. Obtain from /api/auth/login"
        }
    }
    
    # Apply security to all endpoints except /health and auth routes
    for path, path_item in openapi_schema["paths"].items():
        if "/auth/" not in path and "/health" not in path:
            for method in path_item.values():
                if isinstance(method, dict) and "security" not in method:
                    method["security"] = [{"bearerAuth": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

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
