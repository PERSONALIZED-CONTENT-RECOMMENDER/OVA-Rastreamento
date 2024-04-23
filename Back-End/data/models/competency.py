from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import List

from base import db
import subject
import ova

class Competency(db.Model):
    __tablename__ = "competencies"
    
    competency_id: Mapped[int] = mapped_column(primary_key=True)
    competency_description: Mapped[str] = mapped_column(String(255))
    subject_id: Mapped[int] = mapped_column(ForeignKey("course_subjects.subject_id"))
    
    subject: Mapped["subject.Subject"] = relationship("Subject", back_populates="competencies")
    
    ovas: Mapped[List["ova.OVA"]] = relationship("OVA", back_populates="competency")