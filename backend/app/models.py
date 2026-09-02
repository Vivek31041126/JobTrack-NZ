from sqlalchemy import Column, Integer, String, Date, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(150), nullable=False, index=True)
    role = Column(String(150), nullable=False, index=True)
    location = Column(String(150), nullable=True)
    status = Column(String(50), nullable=False, default="Applied", index=True)
    source = Column(String(100), nullable=True)
    applied_date = Column(Date, nullable=False)
    contact_name = Column(String(150), nullable=True)
    contact_email = Column(String(200), nullable=True)
    job_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
