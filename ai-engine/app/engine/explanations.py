
def generate_explanations(result) -> list[str]:
    """
    Generate human-readable explanations from an
    employee's combined scoring result.

    The explanations are based only on information
    available in the scoring result.
    """

    explanations = []

    breakdown = result.score_breakdown

    # --------------------------------------
    # 1. OVERALL COMPATIBILITY
    # --------------------------------------

    explanations.append(
        f"Overall compatibility score: "
        f"{result.compatibility_score}%."
    )

    # --------------------------------------
    # 2. SKILL MATCHING
    # --------------------------------------

    if result.matched_skills:
        explanations.append(
            "Matched required skills: "
            + ", ".join(result.matched_skills)
            + "."
        )
    else:
        explanations.append(
            "No required skills were matched."
        )

    if result.missing_skills:
        explanations.append(
            "Missing required skills: "
            + ", ".join(result.missing_skills)
            + "."
        )
    else:
        explanations.append(
            "All required skills were matched."
        )

    explanations.append(
        f"Skill compatibility score: "
        f"{breakdown.skill_score}%."
    )

    # --------------------------------------
    # 3. EXPERIENCE
    # --------------------------------------

    explanations.append(
        f"Experience compatibility score: "
        f"{breakdown.experience_score}%."
    )

    if result.is_eligible:
        explanations.append(
            "The employee meets the project's minimum "
            "experience requirement."
        )
    elif any(
        "Experience requirement not met" in reason
        for reason in result.eligibility_reasons
    ):
        explanations.append(
            "The employee does not meet the project's "
            "minimum experience requirement."
        )

    # --------------------------------------
    # 4. AVAILABILITY
    # --------------------------------------

    explanations.append(
        f"Availability compatibility score: "
        f"{breakdown.availability_score}%."
    )

    availability_failure = any(
        "hours are available" in reason
        for reason in result.eligibility_reasons
    )

    if availability_failure:
        explanations.append(
            "The employee does not have enough available "
            "hours for this project."
        )
    elif result.is_eligible:
        explanations.append(
            "The employee has sufficient availability "
            "for this project."
        )

    # --------------------------------------
    # 5. CAREER INTERESTS
    # --------------------------------------

    if not result.interest_applicable:

        explanations.append(
            "Career-interest matching was not applied "
            "because the project has no preferred interests."
        )

    else:

        explanations.append(
            f"Career-interest compatibility score: "
            f"{breakdown.interest_score}%."
        )

        if result.matched_interests:
            explanations.append(
                "Matching career interests: "
                + ", ".join(result.matched_interests)
                + "."
            )
        else:
            explanations.append(
                "No matching career interests were found."
            )

    # --------------------------------------
    # 6. FINAL ELIGIBILITY
    # --------------------------------------

    if result.is_eligible:

        explanations.append(
            "FINAL RESULT: The employee is eligible "
            "for this project."
        )

    else:

        explanations.append(
            "FINAL RESULT: The employee is not eligible "
            "for this project."
        )

        for reason in result.eligibility_reasons:
            explanations.append(
                "Reason: " + reason
            )

    return explanations