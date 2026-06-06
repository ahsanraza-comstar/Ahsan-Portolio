from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_articles, get_article, get_article_by_slug, create_article, update_article, delete_article
from app.schemas.schemas import ArticleCreate, ArticleUpdate, ArticleOut
import re, datetime

router = APIRouter(tags=["articles"])


def _slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text


@router.get("", response_model=List[ArticleOut])
def list_articles(db: Session = Depends(get_db)):
    return get_articles(db, published_only=True)


@router.get("/all", response_model=List[ArticleOut], dependencies=[Depends(get_current_admin)])
def list_all_articles(db: Session = Depends(get_db)):
    return get_articles(db, published_only=False)


@router.get("/{slug}", response_model=ArticleOut)
def read_article(slug: str, db: Session = Depends(get_db)):
    obj = get_article_by_slug(db, slug)
    if not obj or not obj.is_published:
        raise HTTPException(404, "Article not found")
    return obj


@router.post("", response_model=ArticleOut, dependencies=[Depends(get_current_admin)])
def add_article(data: ArticleCreate, db: Session = Depends(get_db)):
    payload = data.model_dump()
    if not payload.get("slug"):
        payload["slug"] = _slugify(payload["title"])
    if payload.get("is_published") and not payload.get("published_at"):
        payload["published_at"] = datetime.datetime.utcnow()
    return create_article(db, ArticleCreate(**payload))


@router.put("/{article_id}", response_model=ArticleOut, dependencies=[Depends(get_current_admin)])
def edit_article(article_id: int, data: ArticleUpdate, db: Session = Depends(get_db)):
    payload = data.model_dump(exclude_none=True)
    if "title" in payload and not payload.get("slug"):
        payload["slug"] = _slugify(payload["title"])
    existing = get_article(db, article_id)
    if not existing:
        raise HTTPException(404, "Not found")
    if payload.get("is_published") and not existing.published_at:
        payload["published_at"] = datetime.datetime.utcnow()
    obj = update_article(db, article_id, payload)
    return obj


@router.delete("/{article_id}", dependencies=[Depends(get_current_admin)])
def remove_article(article_id: int, db: Session = Depends(get_db)):
    delete_article(db, article_id)
    return {"ok": True}
