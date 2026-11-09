// ============================================================================
// TalentMatch AI - Semantic Skill Embedding & Knowledge Graph Taxonomy
// Models cosine similarity and domain affinity between technical competencies
// ============================================================================

export const SEMANTIC_SKILL_EMBEDDINGS = {
  // Relational Databases & SQL
  "postgresql": {
    domain: "data_storage",
    vectors: ["sql", "rdbms", "relational", "acid", "query_optimization"],
    affinities: {
      "sql": 0.94,
      "mysql": 0.90,
      "mariadb": 0.88,
      "oracle": 0.84,
      "sql server": 0.86,
      "sqlite": 0.80,
      "database design": 0.92
    }
  },
  "mysql": {
    domain: "data_storage",
    vectors: ["sql", "rdbms", "relational", "acid"],
    affinities: {
      "postgresql": 0.90,
      "sql": 0.93,
      "mariadb": 0.95,
      "sql server": 0.84,
      "database design": 0.90
    }
  },
  "sql": {
    domain: "data_storage",
    vectors: ["queries", "rdbms", "relational", "joins"],
    affinities: {
      "postgresql": 0.94,
      "mysql": 0.93,
      "sql server": 0.92,
      "oracle": 0.88,
      "sqlite": 0.85
    }
  },

  // Python Web & Microservices
  "fastapi": {
    domain: "python_backend",
    vectors: ["python", "asyncio", "pydantic", "rest_api", "openapi", "microservices"],
    affinities: {
      "python": 0.95,
      "flask": 0.88,
      "django": 0.82,
      "rest api": 0.92,
      "docker": 0.78,
      "microservices": 0.90
    }
  },
  "python": {
    domain: "python_backend",
    vectors: ["scripting", "backend", "concurrency", "oop", "data_structures"],
    affinities: {
      "fastapi": 0.95,
      "flask": 0.92,
      "django": 0.90,
      "pytorch": 0.85,
      "pandas": 0.88,
      "backend development": 0.90
    }
  },
  "flask": {
    domain: "python_backend",
    vectors: ["python", "wsgi", "rest_api", "microservices"],
    affinities: {
      "python": 0.92,
      "fastapi": 0.88,
      "django": 0.86,
      "rest api": 0.90
    }
  },

  // Container Orchestration & Infrastructure
  "kubernetes": {
    domain: "cloud_infra",
    vectors: ["containers", "orchestration", "k8s", "helm", "devops", "cloud_native"],
    affinities: {
      "docker": 0.90,
      "containerization": 0.95,
      "aws": 0.84,
      "terraform": 0.82,
      "helm": 0.92,
      "devops": 0.90
    }
  },
  "docker": {
    domain: "cloud_infra",
    vectors: ["containers", "images", "dockerfile", "virtualization"],
    affinities: {
      "kubernetes": 0.90,
      "containerization": 0.98,
      "podman": 0.92,
      "devops": 0.86,
      "ci/cd": 0.82
    }
  },
  "terraform": {
    domain: "cloud_infra",
    vectors: ["iac", "infrastructure_as_code", "hcl", "cloud_provisioning"],
    affinities: {
      "aws": 0.86,
      "kubernetes": 0.82,
      "cloud architecture": 0.88,
      "devops": 0.88,
      "ansible": 0.80
    }
  },
  "aws": {
    domain: "cloud_infra",
    vectors: ["cloud", "ec2", "s3", "iam", "cloud_architecture"],
    affinities: {
      "cloud architecture": 0.96,
      "gcp": 0.84,
      "azure": 0.84,
      "terraform": 0.86,
      "kubernetes": 0.84
    }
  },

  // Modern Frontend & Architecture
  "react": {
    domain: "web_frontend",
    vectors: ["components", "hooks", "vdom", "frontend", "spa", "ui"],
    affinities: {
      "typescript": 0.86,
      "javascript": 0.92,
      "next.js": 0.96,
      "redux": 0.88,
      "tailwind css": 0.82,
      "frontend architecture": 0.95
    }
  },
  "typescript": {
    domain: "web_frontend",
    vectors: ["types", "javascript", "static_analysis", "interfaces"],
    affinities: {
      "javascript": 0.96,
      "react": 0.86,
      "node.js": 0.88,
      "frontend development": 0.88
    }
  },
  "node.js": {
    domain: "javascript_backend",
    vectors: ["event_loop", "npm", "v8", "microservices", "express"],
    affinities: {
      "express": 0.95,
      "typescript": 0.88,
      "javascript": 0.94,
      "rest api": 0.90,
      "backend development": 0.90
    }
  },

  // Machine Learning & Applied AI
  "pytorch": {
    domain: "ai_ml",
    vectors: ["tensors", "deep_learning", "neural_networks", "llm", "transformers"],
    affinities: {
      "python": 0.88,
      "tensorflow": 0.90,
      "deep learning": 0.96,
      "machine learning": 0.92,
      "transformers": 0.90,
      "fastapi": 0.78
    }
  }
};

/**
 * Finds the highest semantic affinity between a required skill and an employee's known skills.
 * @param {string} requiredSkillName 
 * @param {Array<{name: string, proficiency: number}>} employeeSkills 
 * @returns {{ matched: boolean, skillName: string, sourceSkill: string, affinity: number, effectiveProficiency: number }}
 */
export function findSemanticSkillMatch(requiredSkillName, employeeSkills = []) {
  const reqLower = (requiredSkillName || "").toLowerCase().trim();

  // 1. Check for exact match first (affinity = 1.0)
  const exact = employeeSkills.find(
    (s) => (s.name || "").toLowerCase().trim() === reqLower
  );
  if (exact) {
    return {
      matched: true,
      isExact: true,
      skillName: exact.name,
      sourceSkill: exact.name,
      affinity: 1.0,
      effectiveProficiency: exact.proficiency
    };
  }

  // 2. Check Semantic Taxonomy Knowledge Graph
  const embeddingProfile = SEMANTIC_SKILL_EMBEDDINGS[reqLower];
  let bestMatch = null;
  let maxAffinity = 0;

  employeeSkills.forEach((empSkill) => {
    const empLower = (empSkill.name || "").toLowerCase().trim();

    // Direct affinity in required skill's profile
    let affinity = embeddingProfile?.affinities?.[empLower] || 0;

    // Check inverse affinity if defined
    if (!affinity && SEMANTIC_SKILL_EMBEDDINGS[empLower]?.affinities?.[reqLower]) {
      affinity = SEMANTIC_SKILL_EMBEDDINGS[empLower].affinities[reqLower];
    }

    // Check shared domain affinity baseline
    if (!affinity && embeddingProfile?.domain && SEMANTIC_SKILL_EMBEDDINGS[empLower]?.domain === embeddingProfile.domain) {
      affinity = 0.72; // baseline cluster similarity
    }

    if (affinity > maxAffinity && affinity >= 0.75) {
      maxAffinity = affinity;
      bestMatch = {
        matched: true,
        isExact: false,
        skillName: requiredSkillName,
        sourceSkill: empSkill.name,
        affinity: +(affinity.toFixed(2)),
        // Effective proficiency is adjusted by semantic transfer factor
        effectiveProficiency: +(empSkill.proficiency * affinity).toFixed(1)
      };
    }
  });

  if (bestMatch) {
    return bestMatch;
  }

  return {
    matched: false,
    isExact: false,
    skillName: requiredSkillName,
    sourceSkill: null,
    affinity: 0,
    effectiveProficiency: 0
  };
}
