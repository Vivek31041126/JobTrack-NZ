from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from . import crud, schemas, models
from .auth import authenticate_user, create_access_token, get_current_user, hash_password

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JobTrack NZ API",
    description="Authenticated REST API for job applications, analytics and recruiter contacts.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://job-track-nz.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "JobTrack NZ API v3 is running"}


@app.get("/health")
def health():
    return {"status": "ok", "version": "3.0.0"}


@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    user = models.User(
        full_name=payload.full_name.strip(),
        email=email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/token", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(str(user.id))
    return {"access_token": token, "token_type": "bearer"}


@app.get("/auth/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/applications", response_model=list[schemas.JobApplicationOut])
def list_applications(
    status_filter: str | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.list_applications(db, current_user.id, status=status_filter, search=search)


@app.post("/applications", response_model=schemas.JobApplicationOut, status_code=201)
def create_application(
    payload: schemas.JobApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_application(db, payload, current_user.id)


@app.get("/applications/{application_id}", response_model=schemas.JobApplicationOut)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = crud.get_application(db, application_id, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    return obj


@app.patch("/applications/{application_id}", response_model=schemas.JobApplicationOut)
def update_application(
    application_id: int,
    payload: schemas.JobApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = crud.get_application(db, application_id, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    return crud.update_application(db, obj, payload)


@app.delete("/applications/{application_id}", status_code=204)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = crud.get_application(db, application_id, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Application not found")
    crud.delete_application(db, obj)


@app.get("/analytics", response_model=schemas.AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.analytics(db, current_user.id)


@app.get("/contacts", response_model=list[schemas.RecruiterContactOut])
def list_contacts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.list_contacts(db, current_user.id)


@app.post("/contacts", response_model=schemas.RecruiterContactOut, status_code=201)
def create_contact(
    payload: schemas.RecruiterContactCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_contact(db, payload, current_user.id)


@app.patch("/contacts/{contact_id}", response_model=schemas.RecruiterContactOut)
def update_contact(
    contact_id: int,
    payload: schemas.RecruiterContactUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = crud.get_contact(db, contact_id, current_user.id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return crud.update_contact(db, contact, payload)


@app.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = crud.get_contact(db, contact_id, current_user.id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    crud.delete_contact(db, contact)
