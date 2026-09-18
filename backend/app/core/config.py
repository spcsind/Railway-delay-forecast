import os


class Settings:
    PROJECT_NAME = "Dynamic Train ETA API"
    VERSION = "1.0.0"
    API_PREFIX = ""

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:password@localhost:5432/railway_eta"
    )


settings = Settings()