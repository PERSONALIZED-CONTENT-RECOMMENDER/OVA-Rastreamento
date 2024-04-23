from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from base import Base
from courses import Courses
from subjects import Subjects

class Offerings(Base):
    __tablename__ = "offerings"
    
    offering_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.course_id"))
    subject_id: Mapped[int] = mapped_column(ForeignKey("course_subjects.subject_id"))