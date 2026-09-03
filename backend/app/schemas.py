from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: str = Field(min_length=5, max_length=200)
    password: str = Field(min_length=8, max_length=128)

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class JobApplicationBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    status: str = "Applied"
    source: Optional[str] = None
    applied_date: date
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None

class JobApplicationCreate(JobApplicationBase): pass

class JobApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    applied_date: Optional[date] = None
    contact_name: Optional[str] = None
    contact_email: Optional[str] = None
    job_url: Optional[str] = None
    notes: Optional[str] = None

class JobApplicationOut(JobApplicationBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class AnalyticsOut(BaseModel):
    total: int
    applied: int
    screening: int
    interview: int
    offer: int
    rejected: int
