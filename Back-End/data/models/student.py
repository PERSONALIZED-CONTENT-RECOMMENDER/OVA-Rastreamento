from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mssql import BIT
from typing import List, Optional

from base import db
import course
import ova
import interaction

class Student(db.Model):
    __tablename__ = "students"
    student_id: Mapped[int] = mapped_column(primary_key=True)
    ra: Mapped[str] = mapped_column(String(255))
    student_password: Mapped[str] = mapped_column(String(255))
    student_name: Mapped[Optional[str]] = mapped_column(String(255))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.course_id"))
    is_admin: Mapped[int] = mapped_column(BIT)
    
    course: Mapped["course.Course"] = relationship("Course", back_populates="students")
    
    ovas: Mapped[List["ova.OVA"]] = relationship("OVA", secondary="interactions", back_populates="students", viewonly=True)
    
    ova_interactions: Mapped[List["interaction.Interaction"]] = relationship("Interaction", back_populates="student")