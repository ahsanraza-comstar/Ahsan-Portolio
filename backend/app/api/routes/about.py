from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_about, upsert_about
from app.schemas.schemas import AboutOut, AboutUpdate

router = APIRouter(tags=["about"])


@router.get("", response_model=AboutOut)
async def read_about(db: Session = Depends(get_db)):
    about = get_about(db)
    if not about:
        # Return default
        about = upsert_about(db, {
            "name": "Ahsan Raza",
            "tagline": "AI Engineer & Builder",
            "bio": "Passionate AI Engineer specializing in LLMs, ML systems, and full-stack applications. I build intelligent products that sit at the intersection of cutting-edge AI and real-world utility.",
            "location": "Pakistan",
            "years_experience": 3,
        })
    return about


@router.put("", response_model=AboutOut, dependencies=[Depends(get_current_admin)])
async def update_about(data: AboutUpdate, db: Session = Depends(get_db)):
    return upsert_about(db, data.model_dump(exclude_none=True))
