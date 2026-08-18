import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.connection import Base, create_database_if_not_exists, engine
from models.member import MemberModel  # noqa: F401 - registers the table metadata
from models.station import StationModel  # noqa: F401 - registers the table metadata
from routes.member import router as member_router
from routes.station import router as station_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_database_if_not_exists()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="PedallUp API", version="0.1.0", lifespan=lifespan)

cors_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(member_router, prefix="/api/member")
app.include_router(station_router, prefix="/api/bike/seoul/stations")


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
