from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.crud import get_projects, get_project, create_project, update_project, delete_project
from app.schemas.schemas import ProjectOut, ProjectCreate, ProjectUpdate
from typing import List

router = APIRouter(tags=["projects"])


@router.get("", response_model=List[ProjectOut])
async def list_projects(db: Session = Depends(get_db)):
    return get_projects(db)


@router.get("/{project_id}", response_model=ProjectOut)
async def read_project(project_id: int, db: Session = Depends(get_db)):
    obj = get_project(db, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    return obj


@router.post("", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
async def add_project(data: ProjectCreate, db: Session = Depends(get_db)):
    return create_project(db, data)


@router.put("/{project_id}", response_model=ProjectOut, dependencies=[Depends(get_current_admin)])
async def edit_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    obj = update_project(db, project_id, data.model_dump(exclude_none=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    return obj


@router.delete("/{project_id}", dependencies=[Depends(get_current_admin)])
async def remove_project(project_id: int, db: Session = Depends(get_db)):
    obj = delete_project(db, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}
