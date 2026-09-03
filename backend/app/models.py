from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False, index=True)
    full_name = Column(String(150), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("JobApplication", back_populates="owner", cascade="all, delete-orphan")
    contacts = relationship("RecruiterContact", back_populates="owner", cascade="all, delete-orphan")


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

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    owner = relationship("User", back_populates="applications")


class RecruiterContact(Base):
    __tablename__ = "recruiter_contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    company = Column(String(150), nullable=False, index=True)
    email = Column(String(200), nullable=True)
    phone = Column(String(80), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    relationship_stage = Column(String(80), nullable=False, default="New Contact", index=True)
    next_follow_up = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    owner = relationship("User", back_populates="contacts")
