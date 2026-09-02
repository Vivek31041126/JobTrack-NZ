from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JobTrack NZ API",
    description="REST API for tracking job applications, contacts and application outcomes.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "JobTrack NZ API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/applications", response_model=list[schemas.JobApplicationOut])
def list_applications(
    status: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return crud.list_applications(db, status=status, search=search)

@app.get("/applications/{application_id}", response_model=schemas.JobApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    obj = crud.get_application(db, application_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    return obj

@app.post("/applications", response_model=schemas.JobApplicationOut, status_code=201)
def create_application(
    payload: schemas.JobApplicationCreate,
    db: Session = Depends(get_db),
):
    return crud.create_application(db, payload)

@app.patch("/applications/{application_id}", response_model=schemas.JobApplicationOut)
def update_application(
    application_id: int,
    payload: schemas.JobApplicationUpdate,
    db: Session = Depends(get_db),
):
    obj = crud.get_application(db, application_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    return crud.update_application(db, obj, payload)

@app.delete("/applications/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    obj = crud.get_application(db, application_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    crud.delete_application(db, obj)

@app.get("/analytics", response_model=schemas.AnalyticsOut)
def get_analytics(db: Session = Depends(get_db)):
    return crud.analytics(db)
