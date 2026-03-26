from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import Generic, Protocol, TypeVar


T = TypeVar("T")


class CacheBackend(Protocol, Generic[T]):
    def get(self, key: str) -> T | None:
        ...

    def set(self, key: str, value: T, ttl_seconds: int) -> None:
        ...


@dataclass
class CacheEntry(Generic[T]):
    value: T
    expires_at: datetime


class MemoryTTLCache(CacheBackend[T]):
    def __init__(self) -> None:
        self._store: dict[str, CacheEntry[T]] = {}
        self._lock = Lock()

    def get(self, key: str) -> T | None:
        with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            if entry.expires_at <= datetime.now(timezone.utc):
                self._store.pop(key, None)
                return None
            return entry.value

    def set(self, key: str, value: T, ttl_seconds: int) -> None:
        with self._lock:
            self._store[key] = CacheEntry(
                value=value,
                expires_at=datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
            )
