from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.mssql import BIT
from typing import List, Optional

from base import Base
from courses import Courses

class Students(Base):
    student_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ra: Mapped[str] = mapped_column(String(255))
    student_password: Mapped[str] = mapped_column(String(255))
    student_name: Mapped[Optional[str]] = mapped_column(String(255))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.course_id"))
    is_admin: Mapped[int] = mapped_column(BIT)