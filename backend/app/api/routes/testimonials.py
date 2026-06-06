from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_testimonials, create_testimonial, update_testimonial, delete_testimonial
from app.schemas.schemas import TestimonialCreate, TestimonialUpdate, TestimonialOut

router = APIRouter(tags=["testimonials"])


@router.get("", response_model=List[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return get_testimonials(db, active_only=True)


@router.get("/all", response_model=List[TestimonialOut], dependencies=[Depends(get_current_admin)])
def list_all_testimonials(db: Session = Depends(get_db)):
    return get_testimonials(db, active_only=False)


@router.post("", response_model=TestimonialOut, dependencies=[Depends(get_current_admin)])
def add_testimonial(data: TestimonialCreate, db: Session = Depends(get_db)):
    return create_testimonial(db, data)


@router.put("/{t_id}", response_model=TestimonialOut, dependencies=[Depends(get_current_admin)])
def edit_testimonial(t_id: int, data: TestimonialUpdate, db: Session = Depends(get_db)):
    obj = update_testimonial(db, t_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(404, "Not found")
    return obj


@router.delete("/{t_id}", dependencies=[Depends(get_current_admin)])
def remove_testimonial(t_id: int, db: Session = Depends(get_db)):
    delete_testimonial(db, t_id)
    return {"ok": True}
