
from dataclasses import dataclass
import math


@dataclass
class AvailabilityResult:
    """Stores an employee's availability assessment."""

    is_eligible: bool
    available_hours: float
    required_hours: float
    remaining_hours: float
    shortfall_hours: float
    explanation: str


def check_availability(
    available_hours: float,
    required_hours: float
) -> AvailabilityResult:
    """
    Check whether an employee has enough remaining weekly
    availability for a project's weekly time requirement.

    available_hours:
        Remaining hours available for new project work.

    required_hours:
        Hours required by the new project each week.

    Existing workload is not subtracted here because
    available_hours already represents remaining capacity.
    """

    # Validate numeric inputs.
    if isinstance(available_hours, bool) or not isinstance(
        available_hours, (int, float)
    ):
        raise ValueError("Available hours must be a number.")

    if isinstance(required_hours, bool) or not isinstance(
        required_hours, (int, float)
    ):
        raise ValueError("Required hours must be a number.")

    if not math.isfinite(available_hours):
        raise ValueError("Available hours must be finite.")

    if not math.isfinite(required_hours):
        raise ValueError("Required hours must be finite.")

    if available_hours < 0:
        raise ValueError("Available hours cannot be negative.")

    if required_hours <= 0:
        raise ValueError("Required hours must be greater than zero.")

    # Calculate remaining capacity after this assignment.
    remaining_hours = max(
        available_hours - required_hours,
        0
    )

    # Calculate how many additional hours are needed.
    shortfall_hours = max(
        required_hours - available_hours,
        0
    )

    # Check eligibility.
    is_eligible = available_hours >= required_hours

    if is_eligible:
        explanation = (
            f"Employee is eligible. "
            f"{available_hours:g} hours are available and "
            f"{required_hours:g} hours are required."
        )
    else:
        explanation = (
            f"Employee is not eligible. "
            f"{available_hours:g} hours are available, but "
            f"{required_hours:g} hours are required. "
            f"An additional {shortfall_hours:g} hours are needed."
        )

    return AvailabilityResult(
        is_eligible=is_eligible,
        available_hours=available_hours,
        required_hours=required_hours,
        remaining_hours=round(remaining_hours, 2),
        shortfall_hours=round(shortfall_hours, 2),
        explanation=explanation
    )
