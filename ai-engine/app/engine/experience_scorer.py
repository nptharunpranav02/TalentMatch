
from dataclasses import dataclass


@dataclass
class ExperienceScoreResult:
    score: float
    employee_experience: float
    required_experience: float
    experience_gap: float
    meets_requirement: bool


def calculate_experience_score(
    employee_experience: float,
    required_experience: float
) -> ExperienceScoreResult:
    """
    Calculate employee suitability based on years of experience.

    Score is capped at 100.
    """

    # Validate inputs
    if employee_experience < 0:
        raise ValueError("Employee experience cannot be negative.")

    if required_experience < 0:
        raise ValueError("Required experience cannot be negative.")

    # Handle projects with no experience requirement
    if required_experience == 0:
        score = 100.0
    else:
        score = min(
            (employee_experience / required_experience) * 100,
            100.0
        )

    # Calculate experience gap
    experience_gap = max(
        required_experience - employee_experience,
        0
    )

    # Check whether employee meets the minimum requirement
    meets_requirement = (
        employee_experience >= required_experience
    )

    return ExperienceScoreResult(
        score=round(score, 2),
        employee_experience=employee_experience,
        required_experience=required_experience,
        experience_gap=round(experience_gap, 2),
        meets_requirement=meets_requirement
    )
