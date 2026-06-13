from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
import os

from app.core.database import Base, engine, get_db
from app.core.config import settings
from app.models.models import Upload
from app.api.routes import (
    auth, about, services, skills, certifications,
    projects, contact, upload, experience, testimonials,
    articles, analytics,
)

# Create tables
Base.metadata.create_all(bind=engine)

# Rate limiter (keyed by IP)
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    # Disable interactive docs in production (set DOCS_ENABLED=true in .env to re-enable)
    docs_url="/docs"  if os.getenv("DOCS_ENABLED", "false").lower() == "true" else None,
    redoc_url="/redoc" if os.getenv("DOCS_ENABLED", "false").lower() == "true" else None,
    openapi_url="/openapi.json" if os.getenv("DOCS_ENABLED", "false").lower() == "true" else None,
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
allowed_origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"]    = "nosniff"
    response.headers["X-Frame-Options"]           = "DENY"
    response.headers["X-XSS-Protection"]          = "1; mode=block"
    response.headers["Referrer-Policy"]           = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"]        = "camera=(), microphone=(), geolocation=()"
    # Only add HSTS on HTTPS (avoids breaking local dev over HTTP)
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Uploaded files are stored in the database (persist without any volume) and
# served here at /uploads/<filename>.
@app.get("/uploads/{filename}")
def serve_upload(filename: str, db: Session = Depends(get_db)):
    rec = db.query(Upload).filter(Upload.filename == filename).first()
    if not rec:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(
        content=rec.data,
        media_type=rec.content_type or "application/octet-stream",
        headers={"Cache-Control": "public, max-age=31536000, immutable"},
    )

# Routers
app.include_router(auth.router,             prefix="/api/auth")
app.include_router(about.router,            prefix="/api/about")
app.include_router(services.router,         prefix="/api/services")
app.include_router(skills.router,           prefix="/api/skills")
app.include_router(certifications.router,   prefix="/api/certifications")
app.include_router(projects.router,         prefix="/api/projects")
app.include_router(contact.router,          prefix="/api/contact")
app.include_router(upload.router,           prefix="/api/upload")
app.include_router(experience.router,       prefix="/api/experience")
app.include_router(testimonials.router,     prefix="/api/testimonials")
app.include_router(articles.router,         prefix="/api/articles")
app.include_router(analytics.router,        prefix="/api/analytics")


@app.get("/")
async def root():
    return {
        "message": f"{settings.PROJECT_NAME} API is running",
        "db": "postgres" if settings.DATABASE_URL.startswith("postgresql") else "sqlite",
    }
