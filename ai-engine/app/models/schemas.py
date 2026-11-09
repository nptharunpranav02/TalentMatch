
from typing import Annotated
from pydantic import BaseModel, Field, ConfigDict, field_validator


# --------------------------------------------------
# COMMON VALIDATION
# --------------------------------------------------

SkillName = Annotated[str, Field(min_length=1, max_length=60)]
InterestName = Annotated[str, Field(min_length=1, max_length=100)]


def normalize_text(value: str) -> str:
    """Remove unnecessary whitespace and standardize text."""
    return " ".join(value.strip().split())


# --------------------------------------------------
# EMPLOYEE DATA MODEL
# --------------------------------------------------

class EmployeeProfile(BaseModel):
    """
    Represents an employee whose profile will be evaluated
    by the AI matching engine.
    """

    model_config = ConfigDict(str_strip_whitespace=True)

    employee_id: str = Field(min_length=1, max_length=50)
    skills: dict[SkillName, int] = Field(
        description="Skill proficiency levels from 1 (beginner) to 5 (expert)"
    )

    experience_years: float = Field(ge=0, le=60)

    available_hours_per_week: float = Field(ge=0, le=168)

    career_interests: list[InterestName] = Field(default_factory=list)

    current_workload_hours: float = Field(default=0, ge=0, le=168)

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, skills):
        if not skills:
            raise ValueError("An employee must have at least one skill.")

        normalized = {}

        for skill, level in skills.items():
            clean_skill = normalize_text(skill).lower()

            if not clean_skill:
                raise ValueError("Skill names cannot be empty.")

            if not 1 <= level <= 5:
                raise ValueError(
                    f"Invalid proficiency for {skill}. Use levels 1 to 5."
                )

            normalized[clean_skill] = level

        return normalized

    @field_validator("career_interests")
    @classmethod
    def validate_interests(cls, interests):
        return list({
            normalize_text(interest).lower()
            for interest in interests
            if normalize_text(interest)
        })


# --------------------------------------------------
# PROJECT DATA MODEL
# --------------------------------------------------

class ProjectRequirements(BaseModel):
    """
    Represents the requirements of a project against
    which employee profiles will be evaluated.
    """

    model_config = ConfigDict(str_strip_whitespace=True)

    project_id: str = Field(min_length=1, max_length=50)

    required_skills: dict[SkillName, int] = Field(
        description="Required skill proficiency levels from 1 to 5"
    )

    minimum_experience_years: float = Field(default=0, ge=0, le=60)

    required_hours_per_week: float = Field(gt=0, le=168)

    preferred_interests: list[InterestName] = Field(default_factory=list)

    @field_validator("required_skills")
    @classmethod
    def validate_required_skills(cls, skills):
        if not skills:
            raise ValueError("A project must specify required skills.")

        normalized = {}

        for skill, level in skills.items():
            clean_skill = normalize_text(skill).lower()

            if not clean_skill:
                raise ValueError("Skill names cannot be empty.")

            if not 1 <= level <= 5:
                raise ValueError(
                    f"Invalid required proficiency for {skill}. Use levels 1 to 5."
                )

            normalized[clean_skill] = level

        return normalized

    @field_validator("preferred_interests")
    @classmethod
    def validate_interests(cls, interests):
        return list({
            normalize_text(interest).lower()
            for interest in interests
            if normalize_text(interest)
        })


# --------------------------------------------------
# MATCHING REQUEST
# --------------------------------------------------

class MatchingRequest(BaseModel):
    """Input received by the matching API."""

    employees: list[EmployeeProfile] = Field(min_length=1)
    project: ProjectRequirements

    @field_validator("employees")
    @classmethod
    def validate_unique_employees(cls, employees):
        employee_ids = [employee.employee_id for employee in employees]

        if len(employee_ids) != len(set(employee_ids)):
            raise ValueError("Duplicate employee IDs are not allowed.")

        return employees


# --------------------------------------------------
# MATCH SCORE BREAKDOWN
# --------------------------------------------------

class ScoreBreakdown(BaseModel):
    """Individual compatibility scores."""

    skill_score: float = Field(ge=0, le=100)
    experience_score: float = Field(ge=0, le=100)
    availability_score: float = Field(ge=0, le=100)
    interest_score: float = Field(ge=0, le=100)


# --------------------------------------------------
# INDIVIDUAL EMPLOYEE MATCH RESULT
# --------------------------------------------------

class EmployeeMatchResult(BaseModel):
    """AI recommendation for one employee and one project."""

    employee_id: str
    project_id: str

    compatibility_score: float = Field(ge=0, le=100)

    score_breakdown: ScoreBreakdown

    is_eligible: bool

    matched_skills: list[str] = Field(default_factory=list)

    missing_skills: list[str] = Field(default_factory=list)

    explanations: list[str] = Field(default_factory=list)


# --------------------------------------------------
# FINAL MATCHING RESPONSE
# --------------------------------------------------

class MatchingResponse(BaseModel):
    """Ranked employee recommendations returned by the AI API."""

    project_id: str

    recommendations: list[EmployeeMatchResult]

    total_employees_evaluated: int
    total_eligible_employees: int
