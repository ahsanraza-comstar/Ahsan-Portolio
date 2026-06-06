from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_certifications, get_certification, create_certification, update_certification, delete_certification
from app.schemas.schemas import CertificationOut, CertificationCreate, CertificationUpdate
from typing import List

router = APIRouter(tags=["certifications"])


@router.get("", response_model=List[CertificationOut])
async def list_certifications(db: Session = Depends(get_db)):
    return get_certifications(db)


@router.post("", response_model=CertificationOut, dependencies=[Depends(get_current_admin)])
async def add_certification(data: CertificationCreate, db: Session = Depends(get_db)):
    return create_certification(db, data)


@router.put("/{cert_id}", response_model=CertificationOut, dependencies=[Depends(get_current_admin)])
async def edit_certification(cert_id: int, data: CertificationUpdate, db: Session = Depends(get_db)):
    obj = update_certification(db, cert_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Certification not found")
    return obj


@router.delete("/{cert_id}", dependencies=[Depends(get_current_admin)])
async def remove_certification(cert_id: int, db: Session = Depends(get_db)):
    obj = delete_certification(db, cert_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"ok": True}
