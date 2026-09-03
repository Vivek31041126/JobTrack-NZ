from sqlalchemy.orm import Session
from . import models, schemas

def list_applications(db: Session, user_id: int, status: str | None = None, search: str | None = None):
    query = db.query(models.JobApplication).filter(models.JobApplication.user_id == user_id)
    if status: query = query.filter(models.JobApplication.status == status)
    if search:
        term = f"%{search}%"
        query = query.filter((models.JobApplication.company.ilike(term)) | (models.JobApplication.role.ilike(term)))
    return query.order_by(models.JobApplication.applied_date.desc()).all()

def get_application(db: Session, application_id: int, user_id: int):
    return db.query(models.JobApplication).filter(models.JobApplication.id == application_id, models.JobApplication.user_id == user_id).first()

def create_application(db: Session, application: schemas.JobApplicationCreate, user_id: int):
    obj = models.JobApplication(**application.model_dump(), user_id=user_id)
    db.add(obj); db.commit(); db.refresh(obj); return obj

def update_application(db: Session, obj: models.JobApplication, payload: schemas.JobApplicationUpdate):
    for key, value in payload.model_dump(exclude_unset=True).items(): setattr(obj, key, value)
    db.commit(); db.refresh(obj); return obj

def delete_application(db: Session, obj: models.JobApplication):
    db.delete(obj); db.commit()

def analytics(db: Session, user_id: int):
    base = db.query(models.JobApplication).filter(models.JobApplication.user_id == user_id)
    counts = {"total": base.count()}
    for s in ["Applied","Screening","Interview","Offer","Rejected"]:
        counts[s.lower()] = base.filter(models.JobApplication.status == s).count()
    return counts
