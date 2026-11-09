
from dataclasses import dataclass

from app.engine.scoring import OverallScoreResult
from app.models.schemas import EmployeeMatchResult


@dataclass
class RankingResult:
    """Contains separately ranked eligible and ineligible employees."""

    eligible_recommendations: list[EmployeeMatchResult]
    ineligible_employees: list[EmployeeMatchResult]


def rank_employees(
    employee_results: list[tuple[str, OverallScoreResult]],
    project_id: str
) -> RankingResult:
    """
    Rank employees for a single project.

    Args:
        employee_results:
            A list of (employee_id, OverallScoreResult) tuples.

        project_id:
            The project for which employees are being ranked.

    Returns:
        RankingResult containing:
        1. Eligible employees, ranked by compatibility.
        2. Ineligible employees, kept separately.

    Sorting:
        - Highest compatibility score first.
        - Employee ID alphabetically breaks ties.
    """

    if not isinstance(project_id, str) or not project_id.strip():
        raise ValueError("Project ID must be a non-empty string.")

    eligible = []
    ineligible = []

    seen_employee_ids = set()

    for employee_id, result in employee_results:

        # Validate employee ID.
        if not isinstance(employee_id, str) or not employee_id.strip():
            raise ValueError("Employee ID must be a non-empty string.")

        employee_id = employee_id.strip()

        # Prevent duplicate employees.
        if employee_id in seen_employee_ids:
            raise ValueError(
                f"Duplicate employee ID found: {employee_id}"
            )

        seen_employee_ids.add(employee_id)

        # Convert scoring result into the API response model.
        match = EmployeeMatchResult(
            employee_id=employee_id,
            project_id=project_id,
            compatibility_score=result.compatibility_score,
            score_breakdown=result.score_breakdown,
            is_eligible=result.is_eligible,
            matched_skills=result.matched_skills,
            missing_skills=result.missing_skills,
            explanations=(
                result.eligibility_reasons
                if result.eligibility_reasons
                else [
                    f"Compatibility score: "
                    f"{result.compatibility_score}%."
                ]
            )
        )

        # Keep eligible and ineligible employees separate.
        if result.is_eligible:
            eligible.append(match)
        else:
            ineligible.append(match)

    # Rank eligible employees:
    # Highest compatibility first.
    # Employee ID breaks ties consistently.
    eligible.sort(
        key=lambda employee: (
            -employee.compatibility_score,
            employee.employee_id
        )
    )

    # Sort ineligible employees separately for consistent output.
    ineligible.sort(
        key=lambda employee: (
            -employee.compatibility_score,
            employee.employee_id
        )
    )

    return RankingResult(
        eligible_recommendations=eligible,
        ineligible_employees=ineligible
    )
