from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

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

class JobApplicationCreate(JobApplicationBase):
    pass

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
