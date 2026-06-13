import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Engineer Portfolio"
    SECRET_KEY: str = "set-SECRET_KEY-in-env-file"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8

    DATABASE_URL: str = "sqlite:///./portfolio.db"

    # Directory where uploaded files are stored. On Railway, point this at the
    # persistent volume (e.g. /data/uploads) so uploads survive redeploys.
    UPLOAD_DIR: str = "uploads"

    ADMIN_EMAIL: str = "admin@portfolio.dev"
    ADMIN_PASSWORD: str = "admin123"

    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_PORT: int = 587

    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"


settings = Settings()

# ── Persistence safety net ──────────────────────────────────────────────────
# If a Railway persistent volume is mounted at /data, store the SQLite DB and
# uploads there automatically — regardless of the DATABASE_URL/UPLOAD_DIR env
# values. This prevents data loss from a misconfigured DATABASE_URL (e.g. the
# wrong number of slashes) as long as the volume is attached at /data.
DATA_DIR = "/data"
DATA_VOLUME_MOUNTED = os.path.isdir(DATA_DIR) and os.access(DATA_DIR, os.W_OK)
if DATA_VOLUME_MOUNTED:
    if "/data/" not in settings.DATABASE_URL:
        settings.DATABASE_URL = "sqlite:////data/portfolio.db"
    if not settings.UPLOAD_DIR.startswith("/data"):
        settings.UPLOAD_DIR = "/data/uploads"
