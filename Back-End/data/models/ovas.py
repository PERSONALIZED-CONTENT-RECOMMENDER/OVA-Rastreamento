from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import List

from base import Base
from competencies import Competencies

class OVAs(Base):
    ova_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    ova_name: Mapped[str] = mapped_column(String(50))
    competency_id: Mapped[int] = mapped_column(ForeignKey("competencies.competency_id"))
    link: Mapped[str] = mapped_column(String(50))