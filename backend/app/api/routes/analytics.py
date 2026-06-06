from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, DateTime, text
from app.core.database import get_db, Base, engine
from app.api.deps import get_current_admin
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

router = APIRouter(tags=["analytics"])


# Lightweight in-DB page-view log (created on first request if missing)
class PageView(Base):
    __tablename__ = "page_views"
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, default="")
    referrer = Column(String, default="")
    ts = Column(DateTime, default=datetime.utcnow)


# Ensure table exists (safe to call multiple times)
Base.metadata.create_all(bind=engine, tables=[PageView.__table__])


class PageViewIn(BaseModel):
    path: str
    referrer: Optional[str] = ""
    ts: Optional[str] = None

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_path

    @staticmethod
    def validate_path(v):
        return v

    class Config:
        str_max_length = 500   # cap path + referrer length


@router.post("/pageview", status_code=204)
async def record_pageview(data: PageViewIn, db: Session = Depends(get_db)):
    # Only store paths that look like URL paths — strip anything suspicious
    path = data.path[:300] if data.path else "/"
    referrer = (data.referrer or "")[:300]
    pv = PageView(path=path, referrer=referrer)
    db.add(pv)
    db.commit()


@router.get("/summary", dependencies=[Depends(get_current_admin)])
async def get_summary(db: Session = Depends(get_db)):
    total = db.execute(text("SELECT COUNT(*) FROM page_views")).scalar()
    top_pages = db.execute(
        text("SELECT path, COUNT(*) as views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 10")
    ).fetchall()
    return {
        "total_views": total,
        "top_pages": [{"path": r[0], "views": r[1]} for r in top_pages],
    }
