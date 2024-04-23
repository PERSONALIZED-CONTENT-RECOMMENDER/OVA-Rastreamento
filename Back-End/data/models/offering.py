from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from base import db
import course
import subject

class Offering(db.Model):
    __tablename__ = "offerings"
    
    offering_id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.course_id"))
    subject_id: Mapped[int] = mapped_column(ForeignKey("course_subjects.subject_id"))
    
    subject: Mapped["subject.Subject"] = relationship("Subject", back_populates="course_offerings")
    
    course: Mapped["course.Course"] = relationship("Course", back_populates="subject_offerings")