from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_services, get_service, create_service, update_service, delete_service
from app.schemas.schemas import ServiceOut, ServiceCreate, ServiceUpdate
from typing import List

router = APIRouter(tags=["services"])


@router.get("", response_model=List[ServiceOut])
async def list_services(db: Session = Depends(get_db)):
    return get_services(db)


@router.get("/{service_id}", response_model=ServiceOut)
async def read_service(service_id: int, db: Session = Depends(get_db)):
    obj = get_service(db, service_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Service not found")
    return obj


@router.post("", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
async def add_service(data: ServiceCreate, db: Session = Depends(get_db)):
    return create_service(db, data)


@router.put("/{service_id}", response_model=ServiceOut, dependencies=[Depends(get_current_admin)])
async def edit_service(service_id: int, data: ServiceUpdate, db: Session = Depends(get_db)):
    obj = update_service(db, service_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Service not found")
    return obj


@router.delete("/{service_id}", dependencies=[Depends(get_current_admin)])
async def remove_service(service_id: int, db: Session = Depends(get_db)):
    obj = delete_service(db, service_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"ok": True}
