from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import httpx

from app.cache import CacheBackend
from app.config import settings
from app.models import (
    CURRENT_VARIABLES,
    DAILY_VARIABLES,
    HOURLY_VARIABLES,
    LocationSuggestion,
    SearchResponse,
    WeatherLocation,
    WeatherPayload,
    WeatherStatus,
)


class OpenMeteoService:
    def __init__(self, cache: CacheBackend[Any]) -> None:
        self.cache = cache
        self.client = httpx.AsyncClient(timeout=settings.request_timeout_seconds)

    async def close(self) -> None:
        await self.client.aclose()

    async def search_locations(self, query: str) -> tuple[SearchResponse, str]:
        normalized_query = self._normalize_search_query(query)
        cache_key = f"search:{normalized_query.lower()}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached, "HIT"

        results = await self._fetch_search_results(normalized_query)
        if not results and "," in normalized_query:
            results = await self._fetch_search_results(normalized_query.split(",")[0].strip())

        normalized = SearchResponse(query=normalized_query, results=results)
        self.cache.set(cache_key, normalized, settings.geocoding_cache_ttl_seconds)
        return normalized, "MISS"

    async def get_weather(
        self,
        latitude: float,
        longitude: float,
        name: str | None = None,
        country: str | None = None,
        admin: str | None = None,
        timezone_name: str | None = None,
    ) -> tuple[WeatherPayload, str]:
        rounded_lat = round(latitude, 3)
        rounded_lon = round(longitude, 3)
        cache_key = f"weather:{rounded_lat}:{rounded_lon}"
        cached = self.cache.get(cache_key)
        if cached:
            return cached, "HIT"

        params = {
            "latitude": latitude,
            "longitude": longitude,
            "timezone": "auto",
            "forecast_days": 16,
            "models": "best_match",
            "current": ",".join(CURRENT_VARIABLES),
            "hourly": ",".join(HOURLY_VARIABLES),
            "daily": ",".join(DAILY_VARIABLES),
        }
        response = await self.client.get("https://api.open-meteo.com/v1/forecast", params=params)
        response.raise_for_status()
        raw = response.json()
        normalized = self._normalize_weather(raw, name, country, admin, timezone_name)
        self.cache.set(cache_key, normalized, settings.weather_cache_ttl_seconds)
        return normalized, "MISS"

    def _normalize_weather(
        self,
        raw: dict[str, Any],
        name: str | None,
        country: str | None,
        admin: str | None,
        timezone_name: str | None,
    ) -> WeatherPayload:
        current = raw.get("current", {})
        current_units = raw.get("current_units", {})
        hourly = raw.get("hourly", {})
        hourly_units = raw.get("hourly_units", {})
        daily = raw.get("daily", {})
        daily_units = raw.get("daily_units", {})

        normalized_hourly = self._zip_series(hourly, HOURLY_VARIABLES)
        normalized_daily = self._zip_series(daily, DAILY_VARIABLES)

        missing_current = [field for field in CURRENT_VARIABLES if current.get(field) is None]
        missing_hourly = [field for field in HOURLY_VARIABLES if field not in hourly]
        missing_daily = [field for field in DAILY_VARIABLES if field not in daily]

        return WeatherPayload(
            location=WeatherLocation(
                name=name or raw.get("timezone", "Selected location"),
                latitude=raw["latitude"],
                longitude=raw["longitude"],
                timezone=timezone_name or raw.get("timezone"),
                country=country,
                admin=admin,
            ),
            current=current,
            current_units=current_units,
            hourly={"units": hourly_units, "entries": normalized_hourly},
            daily={"units": daily_units, "entries": normalized_daily},
            status=WeatherStatus(
                generated_at=datetime.now(timezone.utc).isoformat(),
                cache_ttl_seconds=settings.weather_cache_ttl_seconds,
                hourly_points=len(normalized_hourly),
                daily_points=len(normalized_daily),
                missing_current_fields=missing_current,
                missing_hourly_fields=missing_hourly,
                missing_daily_fields=missing_daily,
            ),
        )

    @staticmethod
    def _zip_series(raw: dict[str, Any], variables: list[str]) -> list[dict[str, Any]]:
        timestamps = raw.get("time", [])
        rows: list[dict[str, Any]] = []
        for index, timestamp in enumerate(timestamps):
            row: dict[str, Any] = {"time": timestamp}
            for variable in variables:
                series = raw.get(variable)
                row[variable] = series[index] if isinstance(series, list) and index < len(series) else None
            rows.append(row)
        return rows

    async def _fetch_search_results(self, query: str) -> list[LocationSuggestion]:
        response = await self.client.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": query, "count": 10, "language": "en", "format": "json"},
        )
        response.raise_for_status()
        payload = response.json()
        items = payload.get("results", [])
        sorted_items = sorted(
            items,
            key=lambda item: (
                self._query_match_priority(query, item),
                self._feature_priority(item.get("feature_code")),
                -(item.get("population") or 0),
                item.get("name", ""),
            ),
        )
        return [
            LocationSuggestion(
                id=item.get("id"),
                name=item.get("name", "Unknown"),
                display_name=self._build_display_name(item),
                admin=item.get("admin1") or item.get("admin2"),
                country=item.get("country"),
                latitude=item["latitude"],
                longitude=item["longitude"],
                timezone=item.get("timezone"),
            )
            for item in sorted_items
            if item.get("latitude") is not None and item.get("longitude") is not None
        ]

    @staticmethod
    def _normalize_search_query(query: str) -> str:
        return " ".join(part for part in query.replace("/", " ").split() if part).strip()

    @staticmethod
    def _build_display_name(item: dict[str, Any]) -> str:
        parts = [item.get("name"), item.get("admin1") or item.get("admin2"), item.get("country")]
        return ", ".join(part for part in parts if part)

    @staticmethod
    def _feature_priority(feature_code: str | None) -> int:
        priorities = {
            "PPLC": 0,
            "PPLA": 1,
            "PPLA2": 2,
            "PPLA3": 3,
            "PPLA4": 4,
            "PPL": 5,
            "PPLX": 6,
            "ADM1": 7,
            "ADM2": 8,
            "AIRP": 9,
        }
        return priorities.get(feature_code or "", 50)

    @staticmethod
    def _query_match_priority(query: str, item: dict[str, Any]) -> int:
        query_value = query.strip().lower()
        name = str(item.get("name", "")).strip().lower()
        display_name = OpenMeteoService._build_display_name(item).lower()
        prefers_exact = len(query_value) >= 5 or " " in query_value

        if prefers_exact and name == query_value:
            return 0
        if prefers_exact and display_name == query_value:
            return 1
        if name.startswith(query_value):
            return 2
        if display_name.startswith(query_value):
            return 3
        if query_value in name:
            return 4
        if query_value in display_name:
            return 5
        return 10
