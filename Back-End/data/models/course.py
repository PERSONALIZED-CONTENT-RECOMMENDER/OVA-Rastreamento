from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from base import db
import student
import subject
import offering

class Course(db.Model):
    __tablename__ = "courses"
    
    course_id: Mapped[int] = mapped_column(primary_key=True)
    course_name: Mapped[str] = mapped_column(String(255))
    
    students: Mapped[List["student.Student"]] = relationship("Student", back_populates="course")
    
    subjects: Mapped[List["subject.Subject"]] = relationship("Subject", secondary="offerings", back_populates="courses", viewonly=True)
    
    subject_offerings: Mapped[List["offering.Offering"]] = relationship("Offering", back_populates="course")