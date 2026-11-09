from app.engine.semantic_matcher import find_semantic_match

from dataclasses import dataclass, field


@dataclass
class SkillMatchAnalysis:
    """Stores the result of comparing employee skills with project needs."""

    score: float
    matched_skills: list[str] = field(default_factory=list)
    missing_skills: list[str] = field(default_factory=list)
    proficiency_gaps: dict[str, dict[str, int]] = field(default_factory=dict)


def analyze_skill_match(
    employee_skills: dict[str, int],
    required_skills: dict[str, int]
) -> SkillMatchAnalysis:
    """
    Compare employee skills against project requirements.

    Proficiency levels:
        1 = Beginner
        2 = Basic
        3 = Intermediate
        4 = Advanced
        5 = Expert

    Each required skill contributes according to its required
    proficiency level.

    A missing skill receives zero credit.
    A skill meeting or exceeding the requirement receives full credit.
    """

    if not required_skills:
        raise ValueError("Project must have at least one required skill.")

    if not employee_skills:
        employee_skills = {}

    for skill, level in employee_skills.items():
        if not isinstance(level, int) or isinstance(level, bool) or not 1 <= level <= 5:
            raise ValueError(f"Invalid employee proficiency for {skill}.")

    for skill, level in required_skills.items():
        if not isinstance(level, int) or isinstance(level, bool) or not 1 <= level <= 5:
            raise ValueError(f"Invalid required proficiency for {skill}.")

    # Normalize skill names for case-insensitive comparison.
    employee = {
        skill.strip().lower(): level
        for skill, level in employee_skills.items()
    }

    required = {
        skill.strip().lower(): level
        for skill, level in required_skills.items()
    }

    total_weight = sum(required.values())
    earned_weight = 0.0

    matched_skills = []
    missing_skills = []
    proficiency_gaps = {}

    for skill, required_level in required.items():

        employee_level = employee.get(skill)

        if employee_level is None:
            sem = find_semantic_match(skill, employee)
            if sem.matched:
                matched_skills.append(f"{skill} (via {sem.source_skill} {int(sem.affinity * 100)}% semantic fit)")
                achieved_level = min(sem.effective_proficiency, float(required_level))
                earned_weight += achieved_level * sem.affinity
                if sem.effective_proficiency < required_level:
                    proficiency_gaps[skill] = {
                        "employee_level": int(round(sem.effective_proficiency)),
                        "required_level": required_level,
                        "gap": int(round(required_level - sem.effective_proficiency))
                    }
                continue
            missing_skills.append(skill)
            continue

        matched_skills.append(skill)

        # A skill cannot earn more than its required weight.
        achieved_level = min(employee_level, required_level)

        earned_weight += achieved_level

        if employee_level < required_level:
            proficiency_gaps[skill] = {
                "employee_level": employee_level,
                "required_level": required_level,
                "gap": required_level - employee_level
            }

    score = (earned_weight / total_weight) * 100

    return SkillMatchAnalysis(
        score=round(score, 2),
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        proficiency_gaps=proficiency_gaps
    )
