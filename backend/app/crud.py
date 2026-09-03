from sqlalchemy.orm import Session
from . import models, schemas


def list_applications(db: Session, user_id: int, status: str | None = None, search: str | None = None):
    query = db.query(models.JobApplication).filter(models.JobApplication.user_id == user_id)
    if status:
        query = query.filter(models.JobApplication.status == status)
    if search:
        term = f"%{search}%"
        query = query.filter((models.JobApplication.company.ilike(term)) | (models.JobApplication.role.ilike(term)))
    return query.order_by(models.JobApplication.applied_date.desc()).all()


def get_application(db: Session, application_id: int, user_id: int):
    return db.query(models.JobApplication).filter(
        models.JobApplication.id == application_id,
        models.JobApplication.user_id == user_id,
    ).first()


def create_application(db: Session, application: schemas.JobApplicationCreate, user_id: int):
    db_obj = models.JobApplication(**application.model_dump(), user_id=user_id)
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


def analytics(db: Session, user_id: int):
    base = db.query(models.JobApplication).filter(models.JobApplication.user_id == user_id)
    total = base.count()
    statuses = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    counts = {"total": total}
    for application_status in statuses:
        counts[application_status.lower()] = base.filter(
            models.JobApplication.status == application_status
        ).count()
    counts["interview_rate"] = round((counts["interview"] / total * 100), 1) if total else 0.0
    counts["offer_rate"] = round((counts["offer"] / total * 100), 1) if total else 0.0
    return counts


def list_contacts(db: Session, user_id: int):
    return db.query(models.RecruiterContact).filter(
        models.RecruiterContact.user_id == user_id
    ).order_by(models.RecruiterContact.created_at.desc()).all()


def get_contact(db: Session, contact_id: int, user_id: int):
    return db.query(models.RecruiterContact).filter(
        models.RecruiterContact.id == contact_id,
        models.RecruiterContact.user_id == user_id,
    ).first()


def create_contact(db: Session, payload: schemas.RecruiterContactCreate, user_id: int):
    contact = models.RecruiterContact(**payload.model_dump(), user_id=user_id)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def update_contact(db: Session, contact: models.RecruiterContact, payload: schemas.RecruiterContactUpdate):
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact


def delete_contact(db: Session, contact: models.RecruiterContact):
    db.delete(contact)
    db.commit()
