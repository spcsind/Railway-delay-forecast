from fastapi import FastAPI
from app.api.trains import router as train_router


app = FastAPI(
    title="Dynamic Train ETA API",
    description="Backend API for Dynamic Train ETA & Delay Intelligence System",
    version="1.0.0"
)


app.include_router(train_router)


@app.get("/")
def root():
    return {
        "message": "Dynamic Train ETA API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }