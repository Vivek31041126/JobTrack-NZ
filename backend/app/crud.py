from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

def list_applications(db: Session, status: str | None = None, search: str | None = None):
    query = db.query(models.JobApplication)

    if status:
        query = query.filter(models.JobApplication.status == status)

    if search:
        term = f"%{search}%"
        query = query.filter(
            (models.JobApplication.company.ilike(term)) |
            (models.JobApplication.role.ilike(term))
        )

    return query.order_by(models.JobApplication.applied_date.desc()).all()

def get_application(db: Session, application_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id
    ).first()

def create_application(db: Session, application: schemas.JobApplicationCreate):
    db_obj = models.JobApplication(**application.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_application(db: Session, db_obj: models.JobApplication, payload: schemas.JobApplicationUpdate):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_application(db: Session, db_obj: models.JobApplication):
    db.delete(db_obj)
    db.commit()

def analytics(db: Session):
    statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    counts = {"total": db.query(models.JobApplication).count()}
    for status in statuses:
        counts[status.lower()] = db.query(models.JobApplication).filter(
            models.JobApplication.status == status
        ).count()
    return counts
