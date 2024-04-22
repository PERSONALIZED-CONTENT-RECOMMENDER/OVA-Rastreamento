from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from base import Base
from subjects import Subjects

class Competencies(Base):
    __tablename__ = "competencies"
    
    competency_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    competency_description: Mapped[str] = mapped_column(String(255))
    subject_id: Mapped[int] = mapped_column(ForeignKey("course_subjects.competency_id"))