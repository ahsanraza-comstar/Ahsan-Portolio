from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_experiences, create_experience, update_experience, delete_experience
from app.schemas.schemas import ExperienceCreate, ExperienceUpdate, ExperienceOut

router = APIRouter(tags=["experience"])


@router.get("", response_model=List[ExperienceOut])
def list_experiences(db: Session = Depends(get_db)):
    return get_experiences(db)


@router.post("", response_model=ExperienceOut, dependencies=[Depends(get_current_admin)])
def add_experience(data: ExperienceCreate, db: Session = Depends(get_db)):
    return create_experience(db, data)


@router.put("/{exp_id}", response_model=ExperienceOut, dependencies=[Depends(get_current_admin)])
def edit_experience(exp_id: int, data: ExperienceUpdate, db: Session = Depends(get_db)):
    obj = update_experience(db, exp_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(404, "Not found")
    return obj


@router.delete("/{exp_id}", dependencies=[Depends(get_current_admin)])
def remove_experience(exp_id: int, db: Session = Depends(get_db)):
    delete_experience(db, exp_id)
    return {"ok": True}
