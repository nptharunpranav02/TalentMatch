
from dataclasses import dataclass


@dataclass
class InterestMatchResult:
    """Stores the career-interest matching assessment."""

    score: float | None
    matched_interests: list[str]
    unmatched_interests: list[str]
    explanation: str


def normalize_interests(interests: list[str]) -> set[str]:
    """Normalize interest names and remove duplicates."""

    if not isinstance(interests, list):
        raise ValueError("Interests must be provided as a list.")

    normalized = set()

    for interest in interests:
        if not isinstance(interest, str):
            raise ValueError("Every interest must be a string.")

        cleaned = interest.strip().lower()

        if cleaned:
            normalized.add(cleaned)

    return normalized


def analyze_interest_match(
    employee_interests: list[str],
    project_interests: list[str]
) -> InterestMatchResult:
    """
    Compare an employee's career interests with a project's
    preferred interests.

    Score = (Number of matching interests /
             Number of project preferred interests) * 100

    If the project has no preferred interests, the score is
    None because interest matching is not applicable.
    """

    employee_set = normalize_interests(employee_interests)
    project_set = normalize_interests(project_interests)

    # No project preferences means no interest score.
    if not project_set:
        return InterestMatchResult(
            score=None,
            matched_interests=[],
            unmatched_interests=[],
            explanation=(
                "No preferred interests were specified for this "
                "project. Interest matching is not applicable."
            )
        )

    # Find common and unmatched interests.
    matched = employee_set.intersection(project_set)
    unmatched = project_set.difference(employee_set)

    # Calculate the percentage match.
    score = (len(matched) / len(project_set)) * 100

    # Generate an explanation.
    if score == 100:
        explanation = (
            "Strong interest match. The employee matches "
            "all the project's preferred interests."
        )
    elif score > 0:
        explanation = (
            f"Partial interest match. The employee matches "
            f"{len(matched)} out of {len(project_set)} "
            f"preferred interests."
        )
    else:
        explanation = (
            "No matching career interests were found."
        )

    return InterestMatchResult(
        score=round(score, 2),
        matched_interests=sorted(matched),
        unmatched_interests=sorted(unmatched),
        explanation=explanation
    )
