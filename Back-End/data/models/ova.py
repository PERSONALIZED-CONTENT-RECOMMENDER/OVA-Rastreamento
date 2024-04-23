from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from base import db
import competency
import student
import interaction

class OVA(db.Model):
    __tablename__ = "ovas"
    
    ova_id: Mapped[int] = mapped_column(primary_key=True)
    ova_name: Mapped[str] = mapped_column(String(50))
    competency_id: Mapped[int] = mapped_column(ForeignKey("competencies.competency_id"))
    link: Mapped[str] = mapped_column(String(50))
    
    competency: Mapped["competency.Competency"] = relationship("Competency", back_populates="ovas")
    
    students: Mapped[List["student.Student"]] = relationship("Student", secondary="interactions", back_populates="ovas", viewonly=True)
    
    student_interactions: Mapped[List["interaction.Interaction"]] = relationship("Interaction", back_populates="ova")