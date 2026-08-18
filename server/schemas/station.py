from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class StationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str = Field(validation_alias="station_id")
    name: str = Field(validation_alias="station_name")
    district: str
    address: str
    latitude: float
    longitude: float
    installedAt: date = Field(validation_alias="installed_at")
    lcdRackCount: int = Field(validation_alias="lcd_rack_count")
    qrRackCount: int = Field(validation_alias="qr_rack_count")
    total: int = Field(validation_alias="rack_count")
    operationType: str = Field(validation_alias="operation_type")


class StationListResponse(BaseModel):
    stations: list[StationResponse]
