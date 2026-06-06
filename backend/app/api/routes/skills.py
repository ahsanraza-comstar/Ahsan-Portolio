from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_skills, get_skill, create_skill, update_skill, delete_skill
from app.schemas.schemas import SkillOut, SkillCreate, SkillUpdate
from typing import List

router = APIRouter(tags=["skills"])


@router.get("", response_model=List[SkillOut])
async def list_skills(db: Session = Depends(get_db)):
    return get_skills(db)


@router.post("", response_model=SkillOut, dependencies=[Depends(get_current_admin)])
async def add_skill(data: SkillCreate, db: Session = Depends(get_db)):
    return create_skill(db, data)


@router.put("/{skill_id}", response_model=SkillOut, dependencies=[Depends(get_current_admin)])
async def edit_skill(skill_id: int, data: SkillUpdate, db: Session = Depends(get_db)):
    obj = update_skill(db, skill_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Skill not found")
    return obj


@router.delete("/{skill_id}", dependencies=[Depends(get_current_admin)])
async def remove_skill(skill_id: int, db: Session = Depends(get_db)):
    obj = delete_skill(db, skill_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"ok": True}
