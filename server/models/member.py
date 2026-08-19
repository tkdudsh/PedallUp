from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class MemberModel(Base):
    __tablename__ = "members"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    pwd: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    role: Mapped[str] = mapped_column(String(30), nullable=False, default="USER")
