# ============================================================================
# TalentMatch AI Engine - Semantic Skill Embeddings & Knowledge Graph (FastAPI)
# Computes semantic similarity between technical skills
# ============================================================================

from dataclasses import dataclass
from typing import Optional


SEMANTIC_SKILL_EMBEDDINGS: dict[str, dict] = {
    "postgresql": {
        "domain": "data_storage",
        "affinities": {
            "sql": 0.94,
            "mysql": 0.90,
            "mariadb": 0.88,
            "oracle": 0.84,
            "sql server": 0.86,
            "database design": 0.92
        }
    },
    "mysql": {
        "domain": "data_storage",
        "affinities": {
            "postgresql": 0.90,
            "sql": 0.93,
            "mariadb": 0.95,
            "database design": 0.90
        }
    },
    "sql": {
        "domain": "data_storage",
        "affinities": {
            "postgresql": 0.94,
            "mysql": 0.93,
            "sql server": 0.92,
            "oracle": 0.88
        }
    },
    "fastapi": {
        "domain": "python_backend",
        "affinities": {
            "python": 0.95,
            "flask": 0.88,
            "django": 0.82,
            "rest api": 0.92,
            "microservices": 0.90
        }
    },
    "python": {
        "domain": "python_backend",
        "affinities": {
            "fastapi": 0.95,
            "flask": 0.92,
            "django": 0.90,
            "pytorch": 0.85,
            "pandas": 0.88
        }
    },
    "kubernetes": {
        "domain": "cloud_infra",
        "affinities": {
            "docker": 0.90,
            "containerization": 0.95,
            "aws": 0.84,
            "helm": 0.92,
            "devops": 0.90
        }
    },
    "docker": {
        "domain": "cloud_infra",
        "affinities": {
            "kubernetes": 0.90,
            "containerization": 0.98,
            "podman": 0.92,
            "devops": 0.86
        }
    },
    "aws": {
        "domain": "cloud_infra",
        "affinities": {
            "cloud architecture": 0.96,
            "gcp": 0.84,
            "azure": 0.84,
            "terraform": 0.86
        }
    },
    "react": {
        "domain": "web_frontend",
        "affinities": {
            "typescript": 0.86,
            "javascript": 0.92,
            "next.js": 0.96,
            "redux": 0.88
        }
    },
    "typescript": {
        "domain": "web_frontend",
        "affinities": {
            "javascript": 0.96,
            "react": 0.86,
            "node.js": 0.88
        }
    },
    "pytorch": {
        "domain": "ai_ml",
        "affinities": {
            "python": 0.88,
            "tensorflow": 0.90,
            "deep learning": 0.96,
            "machine learning": 0.92
        }
    }
}


@dataclass
class SemanticMatchResult:
    matched: bool
    is_exact: bool
    skill_name: str
    source_skill: Optional[str]
    affinity: float
    effective_proficiency: float


def find_semantic_match(
    required_skill: str,
    employee_skills: dict[str, int],
    threshold: float = 0.75
) -> SemanticMatchResult:
    """Finds best match using exact string or semantic similarity embeddings."""
    req_norm = required_skill.strip().lower()

    # 1. Exact match check
    for emp_skill, level in employee_skills.items():
        if emp_skill.strip().lower() == req_norm:
            return SemanticMatchResult(
                matched=True,
                is_exact=True,
                skill_name=required_skill,
                source_skill=emp_skill,
                affinity=1.0,
                effective_proficiency=float(level)
            )

    # 2. Semantic Embedding Lookup
    profile = SEMANTIC_SKILL_EMBEDDINGS.get(req_norm)
    best_affinity = 0.0
    best_source = None
    best_level = 0.0

    for emp_skill, level in employee_skills.items():
        emp_norm = emp_skill.strip().lower()
        affinity = 0.0

        if profile and emp_norm in profile.get("affinities", {}):
            affinity = profile["affinities"][emp_norm]
        elif emp_norm in SEMANTIC_SKILL_EMBEDDINGS:
            inv_profile = SEMANTIC_SKILL_EMBEDDINGS[emp_norm]
            affinity = inv_profile.get("affinities", {}).get(req_norm, 0.0)

        if affinity > best_affinity and affinity >= threshold:
            best_affinity = affinity
            best_source = emp_skill
            best_level = float(level) * affinity

    if best_affinity >= threshold:
        return SemanticMatchResult(
            matched=True,
            is_exact=False,
            skill_name=required_skill,
            source_skill=best_source,
            affinity=round(best_affinity, 2),
            effective_proficiency=round(best_level, 1)
        )

    return SemanticMatchResult(
        matched=False,
        is_exact=False,
        skill_name=required_skill,
        source_skill=None,
        affinity=0.0,
        effective_proficiency=0.0
    )
