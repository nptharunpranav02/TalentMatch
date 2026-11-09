
from fastapi import APIRouter, HTTPException

from app.models.schemas import MatchingRequest, MatchingResponse
from app.services.matching_service import run_matching


router = APIRouter()


# ==========================================
# HEALTH CHECK
# ==========================================

@router.get("/health")
def health_check():
    """
    Check whether the TalentMatch AI service is running.
    """

    return {
        "status": "healthy",
        "service": "TalentMatch AI Engine",
        "message": "AI matching service is running."
    }


# ==========================================
# EMPLOYEE-PROJECT MATCHING
# ==========================================

@router.post("/match", response_model=MatchingResponse)
def match_employees(request: MatchingRequest):
    """
    Receive employee profiles and project requirements.
    Return ranked employee recommendations.
    """

    try:
        result = run_matching(request)
        return result

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        ) from error
