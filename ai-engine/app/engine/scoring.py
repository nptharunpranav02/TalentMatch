
from dataclasses import dataclass

from app.engine.skill_matcher import analyze_skill_match
from app.engine.experience_scorer import calculate_experience_score
from app.engine.availability_checker import check_availability
from app.engine.interest_matcher import analyze_interest_match

from app.models.schemas import ScoreBreakdown


# ==========================================
# SCORING WEIGHTS
# ==========================================

SKILL_WEIGHT = 0.50
EXPERIENCE_WEIGHT = 0.20
AVAILABILITY_WEIGHT = 0.20
INTEREST_WEIGHT = 0.10


# ==========================================
# RESULT DATA STRUCTURE
# ==========================================

@dataclass
class OverallScoreResult:
    """Stores the complete employee-project scoring result."""

    compatibility_score: float
    is_eligible: bool
    score_breakdown: ScoreBreakdown

    matched_skills: list[str]
    missing_skills: list[str]
    matched_interests: list[str]

    eligibility_reasons: list[str]

    # Distinguishes missing project preferences
    # from an actual zero interest match.
    interest_applicable: bool


# ==========================================
# MAIN COMPATIBILITY SCORING FUNCTION
# ==========================================

def calculate_compatibility(employee, project) -> OverallScoreResult:
    """
    Calculate an employee's overall compatibility with a project.

    Hard eligibility requirements:
    1. Employee must meet minimum experience.
    2. Employee must have sufficient available hours.

    Skills and career interests affect compatibility,
    but do not independently determine eligibility.
    """

    # --------------------------------------
    # 1. SKILL MATCHING
    # --------------------------------------

    skill_result = analyze_skill_match(
        employee.skills,
        project.required_skills
    )

    # --------------------------------------
    # 2. EXPERIENCE SCORING
    # --------------------------------------

    experience_result = calculate_experience_score(
        employee.experience_years,
        project.minimum_experience_years
    )

    # --------------------------------------
    # 3. AVAILABILITY CHECKING
    # --------------------------------------

    availability_result = check_availability(
        employee.available_hours_per_week,
        project.required_hours_per_week
    )

    availability_score = min(
        (
            availability_result.available_hours
            / availability_result.required_hours
        ) * 100,
        100
    )

    # --------------------------------------
    # 4. CAREER INTEREST MATCHING
    # --------------------------------------

    interest_result = analyze_interest_match(
        employee.career_interests,
        project.preferred_interests
    )

    # --------------------------------------
    # 5. OVERALL COMPATIBILITY SCORE
    # --------------------------------------

    if interest_result.score is None:

        # No project preferences were specified.
        # Redistribute the interest weight proportionally
        # across the other three scoring components.

        total_weight = (
            SKILL_WEIGHT
            + EXPERIENCE_WEIGHT
            + AVAILABILITY_WEIGHT
        )

        compatibility_score = (
            skill_result.score * SKILL_WEIGHT
            + experience_result.score * EXPERIENCE_WEIGHT
            + availability_score * AVAILABILITY_WEIGHT
        ) / total_weight

        interest_score = 0.0

    else:

        interest_score = interest_result.score

        compatibility_score = (
            skill_result.score * SKILL_WEIGHT
            + experience_result.score * EXPERIENCE_WEIGHT
            + availability_score * AVAILABILITY_WEIGHT
            + interest_score * INTEREST_WEIGHT
        )

    compatibility_score = round(compatibility_score, 2)

    # --------------------------------------
    # 6. ELIGIBILITY CHECK
    # --------------------------------------

    is_eligible = (
        experience_result.meets_requirement
        and availability_result.is_eligible
    )

    # --------------------------------------
    # 7. ELIGIBILITY EXPLANATIONS
    # --------------------------------------

    eligibility_reasons = []

    if not experience_result.meets_requirement:

        eligibility_reasons.append(
            f"Experience requirement not met: "
            f"{experience_result.employee_experience} years available, "
            f"{experience_result.required_experience} years required."
        )

    if not availability_result.is_eligible:

        eligibility_reasons.append(
            availability_result.explanation
        )

    # --------------------------------------
    # 8. SCORE BREAKDOWN
    # --------------------------------------

    breakdown = ScoreBreakdown(
        skill_score=round(skill_result.score, 2),
        experience_score=round(experience_result.score, 2),
        availability_score=round(availability_score, 2),
        interest_score=round(interest_score, 2)
    )

    # --------------------------------------
    # 9. RETURN COMPLETE RESULT
    # --------------------------------------

    return OverallScoreResult(
        compatibility_score=compatibility_score,
        is_eligible=is_eligible,
        score_breakdown=breakdown,

        matched_skills=skill_result.matched_skills,
        missing_skills=skill_result.missing_skills,
        matched_interests=interest_result.matched_interests,

        eligibility_reasons=eligibility_reasons,

        interest_applicable=interest_result.score is not None
    )
