from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from base import db
import course
import competency
import offering

class Subject(db.Model):
    __tablename__ = "course_subjects"
    
    subject_id: Mapped[int] = mapped_column(primary_key=True)
    subject_name: Mapped[str] = mapped_column(String(255))
    
    competencies: Mapped[List["competency.Competency"]] = relationship("Competency", back_populates="subject")
    
    courses: Mapped[List["course.Course"]] = relationship("Course", secondary="offerings", back_populates="subjects", viewonly=True)
    
    course_offerings: Mapped[List["offering.Offering"]] = relationship("Offering", back_populates="subject")