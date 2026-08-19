from sqlalchemy import select
from sqlalchemy.orm import Session

from models.station import StationModel


class StationRepository:
    """챗봇이 참고할 대여소 데이터를 조회하는 저장소 계층입니다."""

    def list_all(self, db: Session) -> list[StationModel]:
        return list(
            db.scalars(select(StationModel).order_by(StationModel.station_id)).all()
        )
