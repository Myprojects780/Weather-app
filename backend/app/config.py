from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Let it rain API"
    app_env: str = "development"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    cors_origin_regex: str = r"^https://[a-z0-9-]+\.vercel\.app$"
    geocoding_cache_ttl_seconds: int = 1800
    weather_cache_ttl_seconds: int = 600
    request_timeout_seconds: float = 20.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="WEATHER_",
        extra="ignore",
    )


settings = Settings()
