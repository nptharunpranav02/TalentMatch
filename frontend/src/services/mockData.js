// Realistic sample data for TalentMatch MVP
export const initialEmployees = [
  {
    id: "emp-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@talentmatch.io",
    role: "Full Stack Engineer",
    department: "Engineering",
    experienceYears: 4,
    availabilityStatus: "BENCH", // "BENCH" | "ALLOCATED"
    benchSince: "2026-09-15",
    skills: [
      { name: "React", proficiency: 5, years: 4 },
      { name: "Node.js", proficiency: 4, years: 3 },
      { name: "TypeScript", proficiency: 4, years: 3 },
      { name: "PostgreSQL", proficiency: 3, years: 2 }
    ],
    careerInterests: ["Cloud Architecture", "System Design", "Fintech Applications"],
    currentAllocations: []
  },
  {
    id: "emp-2",
    name: "Priya Patel",
    email: "priya.patel@talentmatch.io",
    role: "AI / ML Engineer",
    department: "Data & AI",
    experienceYears: 3,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-01",
    skills: [
      { name: "Python", proficiency: 5, years: 3 },
      { name: "PyTorch", proficiency: 4, years: 2 },
      { name: "FastAPI", proficiency: 4, years: 2 },
      { name: "LangChain", proficiency: 4, years: 1 }
    ],
    careerInterests: ["Generative AI", "LLM Fine-tuning", "Autonomous Agents"],
    currentAllocations: []
  },
  {
    id: "emp-3",
    name: "Rohan Verma",
    email: "rohan.verma@talentmatch.io",
    role: "Cloud & DevOps Specialist",
    department: "Cloud Operations",
    experienceYears: 5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-10",
    skills: [
      { name: "AWS", proficiency: 5, years: 5 },
      { name: "Docker", proficiency: 5, years: 4 },
      { name: "Kubernetes", proficiency: 4, years: 3 },
      { name: "Terraform", proficiency: 4, years: 3 }
    ],
    careerInterests: ["Multi-cloud Architecture", "Platform Engineering", "Security"],
    currentAllocations: []
  },
  {
    id: "emp-4",
    name: "Ananya Iyer",
    email: "ananya.iyer@talentmatch.io",
    role: "Frontend Developer",
    department: "Engineering",
    experienceYears: 2,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-20",
    skills: [
      { name: "React", proficiency: 4, years: 2 },
      { name: "Tailwind CSS", proficiency: 5, years: 2 },
      { name: "JavaScript", proficiency: 4, years: 2 },
      { name: "Redux", proficiency: 3, years: 1.5 }
    ],
    careerInterests: ["Design Systems", "Micro-frontends", "Next.js"],
    currentAllocations: []
  },
  {
    id: "emp-5",
    name: "Vikram Malhotra",
    email: "vikram.m@talentmatch.io",
    role: "Backend Architect",
    department: "Engineering",
    experienceYears: 6,
    availabilityStatus: "ALLOCATED",
    benchSince: null,
    skills: [
      { name: "Java", proficiency: 5, years: 6 },
      { name: "Spring Boot", proficiency: 5, years: 5 },
      { name: "Microservices", proficiency: 5, years: 5 },
      { name: "Kafka", proficiency: 4, years: 3 }
    ],
    careerInterests: ["High-throughput Systems", "Distributed Databases"],
    currentAllocations: ["proj-2"]
  },
  {
    id: "emp-6",
    name: "Sneha Mukherjee",
    email: "sneha.m@talentmatch.io",
    role: "Data Scientist",
    department: "Data & AI",
    experienceYears: 3.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-25",
    skills: [
      { name: "Python", proficiency: 5, years: 3.5 },
      { name: "SQL", proficiency: 4, years: 3 },
      { name: "Tableau", proficiency: 4, years: 2.5 },
      { name: "Scikit-Learn", proficiency: 4, years: 2 }
    ],
    careerInterests: ["Predictive Analytics", "Recommendation Engines"],
    currentAllocations: []
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    name: "NexGen Fintech Mobile Banking",
    client: "Apex Financial Global",
    description: "High-security banking platform with microservices, real-time transfers and dynamic UI.",
    requiredSkills: [
      { name: "React", minProficiency: 4, weight: 1.0 },
      { name: "Node.js", minProficiency: 3, weight: 0.9 },
      { name: "TypeScript", minProficiency: 3, weight: 0.8 },
      { name: "AWS", minProficiency: 3, weight: 0.7 }
    ],
    minExperienceYears: 3,
    teamSize: 4,
    allocatedCount: 1,
    status: "OPEN", // "OPEN" | "FULFILLED" | "COMPLETED"
    priority: "HIGH",
    deadline: "2027-04-30"
  },
  {
    id: "proj-2",
    name: "Enterprise Generative AI Assistant",
    client: "HealthCare Plus Systems",
    description: "Clinical documentation assistant powered by fine-tuned LLMs and vector database retrieval.",
    requiredSkills: [
      { name: "Python", minProficiency: 4, weight: 1.0 },
      { name: "FastAPI", minProficiency: 3, weight: 0.8 },
      { name: "LangChain", minProficiency: 4, weight: 0.9 },
      { name: "Docker", minProficiency: 3, weight: 0.6 }
    ],
    minExperienceYears: 2,
    teamSize: 3,
    allocatedCount: 2,
    status: "OPEN",
    priority: "CRITICAL",
    deadline: "2027-03-15"
  },
  {
    id: "proj-3",
    name: "Cloud Infrastructure Modernization",
    client: "LogiTrans Logistics",
    description: "Migrating legacy monolithic logistics system to Kubernetes clusters with GitOps CI/CD.",
    requiredSkills: [
      { name: "Kubernetes", minProficiency: 4, weight: 1.0 },
      { name: "Docker", minProficiency: 4, weight: 0.9 },
      { name: "Terraform", minProficiency: 4, weight: 0.8 },
      { name: "AWS", minProficiency: 4, weight: 0.9 }
    ],
    minExperienceYears: 4,
    teamSize: 3,
    allocatedCount: 1,
    status: "OPEN",
    priority: "MEDIUM",
    deadline: "2027-06-30"
  }
];

export const initialAllocations = [
  {
    id: "alloc-101",
    employeeId: "emp-2",
    employeeName: "Priya Patel",
    employeeRole: "AI / ML Engineer",
    projectId: "proj-2",
    projectName: "Enterprise Generative AI Assistant",
    aiMatchScore: 96,
    aiExplanation: "Exceptional match! Priya brings 3 years of Python and specialized LangChain expertise. Her career interest specifically targets Generative AI & Autonomous Agents.",
    status: "PENDING_APPROVAL", // "PENDING_APPROVAL" | "APPROVED" | "REJECTED"
    proposedAt: "2026-11-08T10:30:00Z",
    reviewedAt: null,
    managerNotes: ""
  },
  {
    id: "alloc-102",
    employeeId: "emp-3",
    employeeName: "Rohan Verma",
    employeeRole: "Cloud & DevOps Specialist",
    projectId: "proj-3",
    projectName: "Cloud Infrastructure Modernization",
    aiMatchScore: 92,
    aiExplanation: "Perfect fit: Rohan has 5 years total experience exceeding the 4-year minimum, with high proficiency in AWS, Docker, Kubernetes, and Terraform.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-09T08:15:00Z",
    reviewedAt: null,
    managerNotes: ""
  }
];
