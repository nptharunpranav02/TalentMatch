from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="TalentMatch AI Engine",
    description=(
        "Intelligent employee-project matching service. "
        "Evaluates skills, experience, availability and "
        "career interests to generate ranked recommendations."
    ),
    version="1.0.0"
)

# Enable CORS for Frontend & Backend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# REGISTER API ROUTES
# ==========================================

app.include_router(
    router,
    prefix="/api/v1",
    tags=["Talent Matching"]
)


# ==========================================
# ROOT ENDPOINT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "Welcome to TalentMatch AI Engine",
        "version": "1.0.0",
        "documentation": "/docs",
        "health_check": "/api/v1/health"
    }
