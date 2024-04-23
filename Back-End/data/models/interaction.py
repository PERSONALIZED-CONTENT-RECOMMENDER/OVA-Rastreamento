from sqlalchemy import String, ForeignKey, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
import datetime

from base import db
import student
import ova

class Interaction(db.Model):
    __tablename__ = "interactions"
    
    interaction_id: Mapped[int] = mapped_column(primary_key=True)
    interaction_date: Mapped[datetime.date] = mapped_column(Date)
    interaction_time: Mapped[datetime.time] = mapped_column(Time)
    student_action: Mapped[str] = mapped_column(String(255))
    student_id: Mapped[int] = mapped_column(ForeignKey("students.student_id"))
    ova_id: Mapped[int] = mapped_column(ForeignKey("ovas.ova_id"))
    
    student: Mapped["student.Student"] = relationship("Student", back_populates="ova_interactions")
    
    ova: Mapped["ova.OVA"] = relationship("OVA", back_populates="student_interactions")