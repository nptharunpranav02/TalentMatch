
from app.models.schemas import MatchingRequest, MatchingResponse

from app.engine.scoring import calculate_compatibility
from app.engine.ranking import rank_employees
from app.engine.explanations import generate_explanations


def run_matching(request: MatchingRequest) -> MatchingResponse:
    """
    Run the complete employee-project matching pipeline.

    Steps:
    1. Evaluate every employee against the project.
    2. Calculate compatibility scores.
    3. Rank eligible and ineligible employees separately.
    4. Generate explanations for every employee.
    5. Combine the results into the MatchingResponse schema.

    Eligible employees appear first, followed by ineligible
    employees. The is_eligible field identifies each category.
    """

    project = request.project
    employees = request.employees

    # --------------------------------------
    # 1. CALCULATE COMPATIBILITY
    # --------------------------------------

    employee_results = []

    # Keep scoring results so we can generate explanations later.
    scoring_results = {}

    for employee in employees:

        result = calculate_compatibility(
            employee,
            project
        )

        employee_results.append(
            (employee.employee_id, result)
        )

        scoring_results[employee.employee_id] = result

    # --------------------------------------
    # 2. RANK EMPLOYEES
    # --------------------------------------

    ranking = rank_employees(
        employee_results,
        project.project_id
    )

    # --------------------------------------
    # 3. COMBINE RECOMMENDATIONS
    # --------------------------------------

    # Eligible employees come first.
    # Ineligible employees remain visible afterwards.

    recommendations = (
        ranking.eligible_recommendations
        + ranking.ineligible_employees
    )

    # --------------------------------------
    # 4. GENERATE EXPLANATIONS
    # --------------------------------------

    for recommendation in recommendations:

        result = scoring_results[recommendation.employee_id]

        recommendation.explanations = generate_explanations(
            result
        )

    # --------------------------------------
    # 5. CALCULATE SUMMARY COUNTS
    # --------------------------------------

    total_employees = len(employees)

    total_eligible = len(
        ranking.eligible_recommendations
    )

    # --------------------------------------
    # 6. RETURN FINAL RESPONSE
    # --------------------------------------

    return MatchingResponse(
        project_id=project.project_id,
        recommendations=recommendations,
        total_employees_evaluated=total_employees,
        total_eligible_employees=total_eligible
    )