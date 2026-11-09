// Global Universal Enterprise Dataset (Reconciled Single Source of Truth)
// Total Employees: 8 | On Bench: 6 | Allocated: 2 | Total Project Seats Filled: 2 (1 in PRJ-FIN, 1 in PRJ-HLT, 0 in PRJ-LOG)

export const getProficiencyLabel = (num) => {
  if (num >= 4.5) return "Expert";
  if (num >= 3.8) return "Advanced";
  if (num >= 3.0) return "Proficient";
  if (num >= 2.0) return "Intermediate";
  return "Beginner";
};

// 3.3: 4-Tier Enterprise Bench Duration Risk Levels
export const getBenchRiskTier = (benchDays = 0) => {
  if (benchDays > 45) {
    return { 
      tier: "Critical Overhead", 
      level: "critical", 
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300", 
      tag: "45+ Days Idle",
      action: "Requires Immediate Executive Allocation" 
    };
  }
  if (benchDays > 30) {
    return { 
      tier: "High Risk", 
      level: "high", 
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300", 
      tag: "31–45 Days Idle",
      action: "High Priority Staffing Outreach" 
    };
  }
  if (benchDays > 15) {
    return { 
      tier: "Attention Needed", 
      level: "attention", 
      badgeClass: "bg-amber-50 text-amber-800 border-amber-200", 
      tag: "16–30 Days Idle",
      action: "Active SOW Pipeline Matching" 
    };
  }
  return { 
    tier: "Normal Buffer", 
    level: "normal", 
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300", 
    tag: "0–15 Days Idle",
    action: "Standard Onboarding Buffer" 
  };
};

// 3.4: Upskilling & Skill Gap Training Suggestions
export const upskillingCourses = {
  "postgresql": { title: "Production PostgreSQL for Cloud Microservices", duration: "1.5 weeks", provider: "Enterprise Learning Hub" },
  "redis": { title: "Distributed In-Memory Caching with Redis", duration: "1 week", provider: "Cloud Academy" },
  "kafka": { title: "Event-Driven Microservices with Apache Kafka", duration: "2 weeks", provider: "Confluent Learning" },
  "docker": { title: "Containerization & Multi-Stage Docker Deep Dive", duration: "1 week", provider: "Linux Foundation" },
  "kubernetes": { title: "Kubernetes Operator & EKS Cluster Architecture", duration: "2.5 weeks", provider: "CNCF" },
  "terraform": { title: "Infrastructure as Code with HashiCorp Terraform", duration: "1.5 weeks", provider: "HashiCorp Learn" },
  "aws": { title: "AWS Solutions Architecture & Core Cloud Security", duration: "2 weeks", provider: "AWS Training" },
  "fastapi": { title: "High-Performance Asynchronous APIs with FastAPI", duration: "1 week", provider: "Python Institute" },
  "pytorch": { title: "Deep Learning Foundations & LLM Fine-tuning", duration: "3 weeks", provider: "DeepLearning.AI" },
  "react": { title: "Advanced React & Distributed Micro-frontends", duration: "1.5 weeks", provider: "Meta Professional" },
  "typescript": { title: "Enterprise TypeScript & Static Type Safety", duration: "1 week", provider: "TypeScript Guild" },
  "python": { title: "Python Advanced Concurrency & Systems Architecture", duration: "1.5 weeks", provider: "Python Institute" }
};

export const initialProjects = [
  {
    id: "proj-1",
    projectCode: "PRJ-FIN-8021",
    name: "Core Banking & UPI Payments Engine",
    client: "Apex Financial Global",
    clientContact: "Marcus Thorne (Head of Digital Banking)",
    description: "High-throughput real-time payment gateway handling 15,000 TPS with resilient microservices, distributed ledger audit, and dynamic merchant APIs.",
    domain: "Fintech & Banking",
    engagementModel: "Dedicated Pod (T&M)",
    locationRequirement: "Global Remote / Hybrid",
    requiredSkills: [
      { name: "React", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
      { name: "Node.js", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.9 },
      { name: "TypeScript", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 },
      { name: "PostgreSQL", minProficiency: 3.0, targetLabel: "Proficient", weight: 0.7 }
    ],
    minExperienceYears: 3.0,
    targetBand: "L4 / Senior SDE",
    teamSize: 4,
    allocatedCount: 1, // Kenji Takahashi
    assignedEmployeeIds: ["emp-5"],
    status: "OPEN",
    hiringStatus: "Active Hiring",
    priority: "Critical",
    monthlyRevenuePerDev: 14000,
    startDate: "2026-11-01",
    deadline: "2027-03-31",
    milestones: [
      { name: "Sprint 1–3: Core Ledger & Transaction Switch", date: "2026-12-15", status: "In Progress" },
      { name: "Sprint 4–6: Real-time UPI API Gateway", date: "2027-01-30", status: "Upcoming" },
      { name: "Sprint 7–10: Production Cutover & Load Testing", date: "2027-03-31", status: "Pending" }
    ]
  },
  {
    id: "proj-2",
    projectCode: "PRJ-HLT-4912",
    name: "Clinical Summary & Diagnostic AI Pod",
    client: "HealthCare Plus Systems",
    clientContact: "Dr. Evelyn Reed (VP Health Informatics)",
    description: "Enterprise clinical documentation pipeline summarizing electronic health records with secure HIPAA-compliant LLMs and medical retrieval vector stores.",
    domain: "Healthcare & Life Sciences",
    engagementModel: "Agile Innovation Team",
    locationRequirement: "Remote (Global)",
    requiredSkills: [
      { name: "Python", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
      { name: "FastAPI", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 },
      { name: "Docker", minProficiency: 3.0, targetLabel: "Proficient", weight: 0.7 }
    ],
    minExperienceYears: 2.5,
    targetBand: "L4 / SDE-2 or higher",
    teamSize: 3,
    allocatedCount: 1, // Marcus Vance
    assignedEmployeeIds: ["emp-7"],
    status: "OPEN",
    hiringStatus: "Active Hiring",
    priority: "High",
    monthlyRevenuePerDev: 16000,
    startDate: "2026-10-15",
    deadline: "2027-04-15",
    milestones: [
      { name: "HIPAA Zero-Trust Vector Store Setup", date: "2026-11-30", status: "Completed" },
      { name: "EHR RAG Synthesis Engine Integration", date: "2027-01-15", status: "In Progress" },
      { name: "Clinical Pilot in 4 Hospital Networks", date: "2027-04-15", status: "Upcoming" }
    ]
  },
  {
    id: "proj-3",
    projectCode: "PRJ-LOG-3109",
    name: "Multi-Cloud Kubernetes Migration",
    client: "LogiTrans Enterprise Logistics",
    clientContact: "Henrik Lindqvist (Chief Architect)",
    description: "Multi-cluster EKS/GKE infrastructure overhaul with GitOps pipelines, Terraform IAC, and automated multi-region disaster recovery.",
    domain: "Supply Chain & Cloud Infrastructure",
    engagementModel: "Staff Augmentation",
    locationRequirement: "EMEA / APAC Remote",
    requiredSkills: [
      { name: "Kubernetes", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
      { name: "Docker", minProficiency: 4.0, targetLabel: "Advanced", weight: 0.9 },
      { name: "AWS", minProficiency: 4.0, targetLabel: "Advanced", weight: 0.9 },
      { name: "Terraform", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 }
    ],
    minExperienceYears: 4.0,
    targetBand: "L5 / Senior Infrastructure",
    teamSize: 3,
    allocatedCount: 0, // 3 open seats
    assignedEmployeeIds: [],
    status: "OPEN",
    hiringStatus: "Active Hiring",
    priority: "Normal",
    monthlyRevenuePerDev: 18000,
    startDate: "2026-11-20",
    deadline: "2027-06-30",
    milestones: [
      { name: "Terraform Multi-Region Foundation", date: "2026-12-30", status: "Upcoming" },
      { name: "ArgoCD GitOps Cluster Synchronization", date: "2027-03-15", status: "Pending" },
      { name: "Full Traffic Migration & Chaos Testing", date: "2027-06-30", status: "Pending" }
    ]
  }
];

export const initialEmployees = [
  {
    id: "emp-1",
    empCode: "TM-04821",
    name: "Aarav Sharma",
    email: "aarav.sharma@talentmatch.io",
    role: "Senior Full Stack Engineer",
    band: "L4 / Senior SDE",
    department: "Enterprise Web Engineering",
    location: "Bengaluru, India",
    experienceYears: 4.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-12", // 28d idle -> Attention Needed
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["AWS Certified Developer Associate", "Meta Frontend Certified"],
    skills: [
      { name: "React", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
      { name: "TypeScript", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.5 },
      { name: "Node.js", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.5 },
      { name: "PostgreSQL", proficiency: 3.5, proficiencyLabel: "Proficient", years: 2.5 }
    ],
    careerInterests: ["System Design", "Cloud Architecture", "Distributed Systems"],
    performanceRating: "4.8/5.0 (Exceeds Expectations)",
    pastProjects: [
      { client: "Global Commerce Ltd", role: "Frontend Lead", duration: "14 months", tech: "React, TypeScript, Redux" },
      { client: "Fintech Core Labs", role: "Full Stack Engineer", duration: "10 months", tech: "Node.js, PostgreSQL" }
    ]
  },
  {
    id: "emp-2",
    empCode: "TM-03914",
    name: "Elena Rostova",
    email: "elena.rostova@talentmatch.io",
    role: "Lead AI & ML Solutions Engineer",
    band: "L5 / Staff AI Engineer",
    department: "Applied AI & Machine Learning",
    location: "Berlin, Germany",
    experienceYears: 5.0,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-05", // 35d idle -> High Risk
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["Google Cloud Professional Data Engineer", "DeepLearning.AI LangChain"],
    skills: [
      { name: "Python", proficiency: 5.0, proficiencyLabel: "Expert", years: 5.0 },
      { name: "FastAPI", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 },
      { name: "PyTorch", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.0 },
      { name: "Docker", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 }
    ],
    careerInterests: ["Generative AI", "RAG Pipelines", "Healthcare & Life Sciences"],
    performanceRating: "4.9/5.0 (Top 5% Engineering Tier)",
    pastProjects: [
      { client: "Charité Health Analytics", role: "AI Research Engineer", duration: "18 months", tech: "PyTorch, FastAPI, Docker" },
      { client: "Siemens AI Pod", role: "MLOps Lead", duration: "12 months", tech: "Python, Docker, Kubernetes" }
    ]
  },
  {
    id: "emp-3",
    empCode: "TM-02911",
    name: "David Okafor",
    email: "david.okafor@talentmatch.io",
    role: "Staff DevOps & SRE Engineer",
    band: "L5 / Senior Infrastructure Engineer",
    department: "Cloud Platform Engineering",
    location: "London, United Kingdom",
    experienceYears: 5.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-09-24", // 46d idle -> Critical Overhead
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["CKA (Certified Kubernetes Admin)", "AWS Solutions Architect Professional", "HashiCorp Terraform"],
    skills: [
      { name: "AWS", proficiency: 5.0, proficiencyLabel: "Expert", years: 5.5 },
      { name: "Kubernetes", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
      { name: "Docker", proficiency: 5.0, proficiencyLabel: "Expert", years: 4.5 },
      { name: "Terraform", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 }
    ],
    careerInterests: ["Platform Engineering", "GitOps", "Zero-Trust Security"],
    performanceRating: "4.8/5.0 (Consistently Exceeds)",
    pastProjects: [
      { client: "Barclays Cloud Gateway", role: "Lead SRE", duration: "16 months", tech: "AWS, EKS, Terraform" },
      { client: "BT Telecom Platform", role: "DevOps Engineer", duration: "11 months", tech: "Docker, Kubernetes, CI/CD" }
    ]
  },
  {
    id: "emp-4",
    empCode: "TM-05192",
    name: "Sarah Jenkins",
    email: "sarah.jenkins@talentmatch.io",
    role: "Frontend Software Engineer",
    band: "L3 / Software Engineer",
    department: "Enterprise Web Engineering",
    location: "San Francisco, United States",
    experienceYears: 2.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-28", // 12d idle -> Normal Buffer
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["React Advanced Certified", "AWS Cloud Practitioner"],
    skills: [
      { name: "React", proficiency: 4.5, proficiencyLabel: "Expert", years: 2.5 },
      { name: "Tailwind CSS", proficiency: 5.0, proficiencyLabel: "Expert", years: 2.5 },
      { name: "JavaScript", proficiency: 4.0, proficiencyLabel: "Advanced", years: 2.5 },
      { name: "Redux", proficiency: 3.5, proficiencyLabel: "Proficient", years: 1.5 }
    ],
    careerInterests: ["Design Systems", "Web Performance", "Micro-frontends"],
    performanceRating: "4.7/5.0 (Strong Contributor)",
    pastProjects: [
      { client: "Silicon Valley FinTech", role: "UI Engineer", duration: "14 months", tech: "React, Tailwind, Redux" }
    ]
  },
  {
    id: "emp-5",
    empCode: "TM-01824",
    name: "Kenji Takahashi",
    email: "kenji.takahashi@talentmatch.io",
    role: "Principal Distributed Systems Architect",
    band: "L6 / Principal Architect",
    department: "Enterprise Systems",
    location: "Tokyo, Japan",
    experienceYears: 8.5,
    availabilityStatus: "ALLOCATED", // ALLOCATED to proj-1
    benchSince: null,
    assignedProjectId: "proj-1",
    assignedProjectName: "Core Banking & UPI Payments Engine",
    certifications: ["Oracle Certified Master Java", "Confluent Certified Kafka Developer"],
    skills: [
      { name: "Java", proficiency: 5.0, proficiencyLabel: "Expert", years: 8.5 },
      { name: "React", proficiency: 4.0, proficiencyLabel: "Advanced", years: 4.0 },
      { name: "Node.js", proficiency: 4.5, proficiencyLabel: "Expert", years: 5.0 },
      { name: "PostgreSQL", proficiency: 5.0, proficiencyLabel: "Expert", years: 6.0 }
    ],
    careerInterests: ["High-Throughput Systems", "Event-driven Architecture", "Fintech & Banking"],
    performanceRating: "5.0/5.0 (Principal Evaluator Tier)",
    pastProjects: [
      { client: "Tokyo Stock Exchange Gateway", role: "Principal Architect", duration: "24 months", tech: "Java, Kafka, Distributed Ledger" },
      { client: "Rakuten Banking Switch", role: "Systems Lead", duration: "15 months", tech: "PostgreSQL, Microservices" }
    ]
  },
  {
    id: "emp-6",
    empCode: "TM-04108",
    name: "Camila Silva",
    email: "camila.silva@talentmatch.io",
    role: "Senior Data & Analytics Specialist",
    band: "L4 / Senior Analyst",
    department: "Applied AI & Analytics",
    location: "Toronto, Canada",
    experienceYears: 3.8,
    availabilityStatus: "BENCH",
    benchSince: "2026-11-01", // 8d idle -> Normal Buffer
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["Tableau Desktop Specialist", "Microsoft Azure Data Fundamentals"],
    skills: [
      { name: "Python", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 },
      { name: "SQL", proficiency: 5.0, proficiencyLabel: "Expert", years: 3.8 },
      { name: "Tableau", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 },
      { name: "Pandas", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.0 }
    ],
    careerInterests: ["Executive Analytics", "Predictive Modeling", "Snowflake"],
    performanceRating: "4.7/5.0 (High Precision Analytics)",
    pastProjects: [
      { client: "Royal Bank of Canada", role: "Lead Data Analyst", duration: "16 months", tech: "Python, SQL, Tableau" }
    ]
  },
  {
    id: "emp-7",
    empCode: "TM-06231",
    name: "Marcus Vance",
    email: "marcus.vance@talentmatch.io",
    role: "Senior Full Stack AI Developer",
    band: "L4 / Senior SDE",
    department: "Applied AI & Machine Learning",
    location: "Austin, United States",
    experienceYears: 4.2,
    availabilityStatus: "ALLOCATED", // ALLOCATED to proj-2
    benchSince: null,
    assignedProjectId: "proj-2",
    assignedProjectName: "Clinical Summary & Diagnostic AI Pod",
    certifications: ["AWS Certified Machine Learning", "Docker Certified Associate"],
    skills: [
      { name: "Python", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
      { name: "FastAPI", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 },
      { name: "Docker", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 }
    ],
    careerInterests: ["Healthcare & Life Sciences", "LLM Fine-tuning", "Microservices"],
    performanceRating: "4.8/5.0 (Outstanding Execution)",
    pastProjects: [
      { client: "Mayo Clinic Pod", role: "AI Integrations Engineer", duration: "14 months", tech: "FastAPI, Docker, Python" }
    ]
  },
  {
    id: "emp-8",
    empCode: "TM-07342",
    name: "Priya Nair",
    email: "priya.nair@talentmatch.io",
    role: "Cloud Infrastructure Engineer",
    band: "L3 / Software Engineer",
    department: "Cloud Platform Engineering",
    location: "Hyderabad, India",
    experienceYears: 2.8,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-18", // 22d idle -> Attention Needed
    assignedProjectId: null,
    assignedProjectName: null,
    certifications: ["AWS Certified SysOps Administrator", "Terraform Associate"],
    skills: [
      { name: "AWS", proficiency: 4.0, proficiencyLabel: "Advanced", years: 2.5 },
      { name: "Docker", proficiency: 4.0, proficiencyLabel: "Advanced", years: 2.5 },
      { name: "Kubernetes", proficiency: 3.5, proficiencyLabel: "Proficient", years: 2.0 },
      { name: "Terraform", proficiency: 3.5, proficiencyLabel: "Proficient", years: 1.8 }
    ],
    careerInterests: ["Supply Chain & Cloud Infrastructure", "Site Reliability", "Security"],
    performanceRating: "4.6/5.0 (Promising SRE Talent)",
    pastProjects: [
      { client: "Flipkart Cloud Infra", role: "Associate DevOps", duration: "12 months", tech: "AWS, Docker, Terraform" }
    ]
  }
];

export const initialAllocations = [
  {
    id: "alloc-101",
    employeeId: "emp-2",
    empCode: "TM-03914",
    employeeName: "Elena Rostova",
    employeeRole: "Lead AI & ML Solutions Engineer",
    employeeBand: "L5 / Staff AI Engineer",
    projectId: "proj-2",
    projectCode: "PRJ-HLT-4912",
    projectName: "Clinical Summary & Diagnostic AI Pod",
    clientName: "HealthCare Plus Systems",
    aiMatchScore: 96,
    scoreBreakdown: {
      technicalFit: 58,
      experienceFit: 25,
      aspirationFit: 13
    },
    aiExplanation: "Matches 3 of 3 core competencies (Python 5.0/4.0, FastAPI 4.5/3.5, Docker 4.0/3.0). Verified 5.0y experience exceeds 2.5y project threshold. Direct domain alignment with stated career goals in RAG pipelines and Healthcare AI.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-08T10:30:00Z",
    effectiveStartDate: "2026-11-16",
    reviewedAt: null,
    managerNotes: "High-priority staffing candidate. Recommended by Staff Tech Lead."
  }
];
