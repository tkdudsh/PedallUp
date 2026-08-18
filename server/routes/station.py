from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from database.connection import get_db
from models.station import StationModel
from schemas.station import StationListResponse


router = APIRouter(tags=["bike station"])


@router.get("", response_model=StationListResponse)
def get_stations(db: Session = Depends(get_db)) -> StationListResponse:
    stations = db.scalars(
        select(StationModel).order_by(StationModel.station_id)
    ).all()
    return StationListResponse(stations=stations)
