from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from base import Base

class Courses(Base):
    __tablename__ = "courses"
    
    course_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    course_name: Mapped[str] = mapped_column(String(255))