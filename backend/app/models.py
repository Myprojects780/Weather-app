from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


CURRENT_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "is_day",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "surface_pressure",
    "pressure_msl",
]

HOURLY_VARIABLES = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "surface_pressure",
    "pressure_msl",
    "precipitation",
    "rain",
    "showers",
    "snowfall",
    "precipitation_probability",
    "cloud_cover",
    "cloud_cover_low",
    "cloud_cover_mid",
    "cloud_cover_high",
    "visibility",
    "uv_index",
    "sunshine_duration",
    "direct_radiation",
    "diffuse_radiation",
    "soil_temperature_0cm",
    "soil_moisture_0_to_1cm",
]

DAILY_VARIABLES = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "sunrise",
    "sunset",
]


class LocationSuggestion(BaseModel):
    id: int | None = None
    name: str
    display_name: str | None = None
    admin: str | None = None
    country: str | None = None
    latitude: float
    longitude: float
    timezone: str | None = None


class SearchResponse(BaseModel):
    query: str
    results: list[LocationSuggestion]


class WeatherLocation(BaseModel):
    name: str
    latitude: float
    longitude: float
    timezone: str | None = None
    country: str | None = None
    admin: str | None = None


class WeatherStatus(BaseModel):
    generated_at: str
    cache_ttl_seconds: int
    hourly_points: int
    daily_points: int
    missing_current_fields: list[str] = Field(default_factory=list)
    missing_hourly_fields: list[str] = Field(default_factory=list)
    missing_daily_fields: list[str] = Field(default_factory=list)


class WeatherPayload(BaseModel):
    location: WeatherLocation
    current: dict[str, Any]
    current_units: dict[str, str]
    hourly: dict[str, Any]
    daily: dict[str, Any]
    status: WeatherStatus
