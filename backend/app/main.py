from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware

from app.cache import MemoryTTLCache
from app.config import settings
from app.services.open_meteo import OpenMeteoService


cache = MemoryTTLCache()


@asynccontextmanager
async def lifespan(app: FastAPI):
    service = OpenMeteoService(cache)
    app.state.weather_service = service
    yield
    await service.close()


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Cache"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}


@app.get("/search")
async def search_locations(response: Response, q: str = Query(min_length=2)):
    service: OpenMeteoService = app.state.weather_service
    try:
        payload, cache_status = await service.search_locations(q)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Search provider unavailable") from exc

    response.headers["X-Cache"] = cache_status
    return payload


@app.get("/weather")
async def get_weather(
    lat: float,
    lon: float,
    response: Response,
    name: str | None = None,
    country: str | None = None,
    admin: str | None = None,
    timezone: str | None = None,
):
    service: OpenMeteoService = app.state.weather_service
    try:
        payload, cache_status = await service.get_weather(lat, lon, name, country, admin, timezone)
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Weather provider unavailable") from exc

    response.headers["X-Cache"] = cache_status
    return payload
