import pytest
from pydantic import ValidationError

from app.engine.skill_matcher import analyze_skill_match
from app.engine.experience_scorer import calculate_experience_score
from app.engine.availability_checker import check_availability
from app.engine.interest_matcher import analyze_interest_match
from app.engine.scoring import calculate_compatibility
from app.services.matching_service import run_matching
from app.models.schemas import EmployeeProfile, ProjectRequirements, MatchingRequest


def employee(**overrides):
    values = dict(employee_id="e1", skills={"python": 4, "sql": 3}, experience_years=5,
                  available_hours_per_week=40, current_workload_hours=0,
                  career_interests=["AI", "Cloud"])
    values.update(overrides)
    return EmployeeProfile(**values)


def project(**overrides):
    values = dict(project_id="p1", required_skills={"python": 3, "sql": 3},
                  minimum_experience_years=3, required_hours_per_week=30,
                  preferred_interests=["AI"])
    values.update(overrides)
    return ProjectRequirements(**values)


def test_skill_full_match():
    assert analyze_skill_match({"python": 4}, {"python": 3}).score == 100


def test_skill_case_insensitive():
    assert analyze_skill_match({" PYTHON ": 3}, {"python": 3}).score == 100


def test_skill_missing_is_zero():
    result = analyze_skill_match({}, {"python": 4})
    assert result.score == 0 and result.missing_skills == ["python"]


def test_skill_partial_proficiency():
    result = analyze_skill_match({"python": 2}, {"python": 4})
    assert result.score == 50 and result.proficiency_gaps["python"]["gap"] == 2


def test_skill_rejects_empty_requirements():
    with pytest.raises(ValueError): analyze_skill_match({}, {})


def test_skill_rejects_invalid_level():
    with pytest.raises(ValueError): analyze_skill_match({"python": 6}, {"python": 3})


def test_experience_meets_requirement():
    result = calculate_experience_score(4, 3)
    assert result.score == 100 and result.meets_requirement


def test_experience_below_requirement():
    result = calculate_experience_score(2, 4)
    assert result.score == 50 and not result.meets_requirement


def test_zero_experience_requirement():
    assert calculate_experience_score(0, 0).score == 100


def test_negative_experience_rejected():
    with pytest.raises(ValueError): calculate_experience_score(-1, 2)


def test_availability_enough_hours():
    result = check_availability(40, 30)
    assert result.is_eligible and result.remaining_hours == 10


def test_availability_shortfall():
    result = check_availability(20, 30)
    assert not result.is_eligible and result.shortfall_hours == 10


def test_availability_rejects_zero_required():
    with pytest.raises(ValueError): check_availability(40, 0)


def test_availability_rejects_boolean():
    with pytest.raises(ValueError): check_availability(True, 10)


def test_interest_full_match():
    assert analyze_interest_match(["AI"], ["ai"]).score == 100


def test_interest_partial_match():
    result = analyze_interest_match(["AI"], ["AI", "Cloud"])
    assert result.score == 50 and result.unmatched_interests == ["cloud"]


def test_interest_not_applicable_without_project_preferences():
    assert analyze_interest_match(["AI"], []).score is None


def test_matching_pipeline_ranks_eligible_first():
    request = MatchingRequest(project=project(), employees=[
        employee(employee_id="eligible"),
        employee(employee_id="ineligible", experience_years=1)
    ])
    result = run_matching(request)
    assert result.recommendations[0].employee_id == "eligible"
    assert result.total_eligible_employees == 1


def test_matching_request_rejects_duplicate_employee_ids():
    with pytest.raises(ValidationError):
        MatchingRequest(project=project(), employees=[employee(), employee()])
