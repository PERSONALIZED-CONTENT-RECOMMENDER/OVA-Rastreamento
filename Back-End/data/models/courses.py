from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List

from base import Base
from students import Students
from subjects import Subjects

class Courses(Base):
    __tablename__ = "courses"
    
    course_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_name: Mapped[str] = mapped_column(String(255))