from datetime import date
from decimal import Decimal

from sqlalchemy import Date, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class StationModel(Base):
    __tablename__ = "bike_stations"

    station_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    station_name: Mapped[str] = mapped_column(String(100), nullable=False)
    district: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[Decimal] = mapped_column(Numeric(10, 8), nullable=False)
    longitude: Mapped[Decimal] = mapped_column(Numeric(11, 8), nullable=False)
    installed_at: Mapped[date] = mapped_column(Date, nullable=False)
    lcd_rack_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    qr_rack_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rack_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    operation_type: Mapped[str] = mapped_column(String(20), nullable=False)
