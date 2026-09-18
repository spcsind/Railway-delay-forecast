from fastapi import FastAPI

app = FastAPI(
    title="Dynamic Train ETA API",
    description="Backend API for Dynamic Train ETA & Delay Intelligence System",
    version="1.0.0"
)


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