// Realistic IT bench and project data
export const initialEmployees = [
  {
    id: "emp-1",
    name: "Aarav Sharma",
    email: "aarav.sharma@company.com",
    role: "Full Stack Developer (SDE-2)",
    department: "Web Technologies",
    experienceYears: 4,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-12",
    skills: [
      { name: "React", proficiency: 4, years: 4 },
      { name: "Node.js", proficiency: 4, years: 3 },
      { name: "TypeScript", proficiency: 4, years: 3 },
      { name: "PostgreSQL", proficiency: 3, years: 2 }
    ],
    careerInterests: ["System Design", "Cloud Infrastructure"],
    currentAllocations: []
  },
  {
    id: "emp-2",
    name: "Priya Patel",
    email: "priya.patel@company.com",
    role: "Python / ML Engineer",
    department: "Data & AI",
    experienceYears: 3,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-05",
    skills: [
      { name: "Python", proficiency: 5, years: 3 },
      { name: "FastAPI", proficiency: 4, years: 2 },
      { name: "PyTorch", proficiency: 4, years: 2 },
      { name: "Docker", proficiency: 3, years: 2 }
    ],
    careerInterests: ["Generative AI", "Backend API Development"],
    currentAllocations: []
  },
  {
    id: "emp-3",
    name: "Rohan Verma",
    email: "rohan.verma@company.com",
    role: "DevOps Engineer",
    department: "Cloud Operations",
    experienceYears: 5,
    availabilityStatus: "BENCH",
    benchSince: "2026-09-28",
    skills: [
      { name: "AWS", proficiency: 5, years: 5 },
      { name: "Docker", proficiency: 5, years: 4 },
      { name: "Kubernetes", proficiency: 4, years: 3 },
      { name: "Terraform", proficiency: 4, years: 3 }
    ],
    careerInterests: ["Kubernetes", "CI/CD Automation", "Platform Engineering"],
    currentAllocations: []
  },
  {
    id: "emp-4",
    name: "Ananya Iyer",
    email: "ananya.iyer@company.com",
    role: "Frontend Developer (SDE-1)",
    department: "Web Technologies",
    experienceYears: 2,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-24",
    skills: [
      { name: "React", proficiency: 4, years: 2 },
      { name: "Tailwind CSS", proficiency: 4, years: 2 },
      { name: "JavaScript", proficiency: 4, years: 2 },
      { name: "Redux", proficiency: 3, years: 1 }
    ],
    careerInterests: ["Frontend Architecture", "UI Performance"],
    currentAllocations: []
  },
  {
    id: "emp-5",
    name: "Vikram Malhotra",
    email: "vikram.m@company.com",
    role: "Backend Lead",
    department: "Enterprise Systems",
    experienceYears: 6.5,
    availabilityStatus: "ALLOCATED",
    benchSince: null,
    skills: [
      { name: "Java", proficiency: 5, years: 6 },
      { name: "Spring Boot", proficiency: 5, years: 5 },
      { name: "Microservices", proficiency: 5, years: 5 },
      { name: "Kafka", proficiency: 4, years: 3 }
    ],
    careerInterests: ["Distributed Systems"],
    currentAllocations: ["proj-2"]
  },
  {
    id: "emp-6",
    name: "Sneha Mukherjee",
    email: "sneha.m@company.com",
    role: "Data Analyst",
    department: "Data & AI",
    experienceYears: 3,
    availabilityStatus: "BENCH",
    benchSince: "2026-11-01",
    skills: [
      { name: "Python", proficiency: 4, years: 3 },
      { name: "SQL", proficiency: 5, years: 3 },
      { name: "Tableau", proficiency: 4, years: 2.5 },
      { name: "Pandas", proficiency: 4, years: 2.5 }
    ],
    careerInterests: ["Business Intelligence", "Analytics"],
    currentAllocations: []
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    name: "Core Banking Portal",
    client: "Apex Financial",
    description: "Customer-facing portal overhaul with real-time transaction updates, React frontend and Node microservices.",
    requiredSkills: [
      { name: "React", minProficiency: 4 },
      { name: "Node.js", minProficiency: 3 },
      { name: "TypeScript", minProficiency: 3 },
      { name: "PostgreSQL", minProficiency: 3 }
    ],
    minExperienceYears: 3,
    teamSize: 4,
    allocatedCount: 1,
    status: "OPEN",
    priority: "High",
    deadline: "2027-03-31"
  },
  {
    id: "proj-2",
    name: "Clinical Summary Assistant",
    client: "HealthCare Plus",
    description: "Internal clinician portal that summarizes doctor notes and lab reports using Python and FastAPI backends.",
    requiredSkills: [
      { name: "Python", minProficiency: 4 },
      { name: "FastAPI", minProficiency: 3 },
      { name: "Docker", minProficiency: 3 }
    ],
    minExperienceYears: 2,
    teamSize: 3,
    allocatedCount: 2,
    status: "OPEN",
    priority: "High",
    deadline: "2027-04-15"
  },
  {
    id: "proj-3",
    name: "Kubernetes Migration",
    client: "LogiTrans Logistics",
    description: "Migrating containerized services from legacy EC2 instances to Amazon EKS with automated Terraform scripts.",
    requiredSkills: [
      { name: "Kubernetes", minProficiency: 4 },
      { name: "Docker", minProficiency: 4 },
      { name: "AWS", minProficiency: 4 },
      { name: "Terraform", minProficiency: 3 }
    ],
    minExperienceYears: 4,
    teamSize: 3,
    allocatedCount: 1,
    status: "OPEN",
    priority: "Medium",
    deadline: "2027-06-30"
  }
];

export const initialAllocations = [
  {
    id: "alloc-101",
    employeeId: "emp-2",
    employeeName: "Priya Patel",
    employeeRole: "Python / ML Engineer",
    projectId: "proj-2",
    projectName: "Clinical Summary Assistant",
    aiMatchScore: 94,
    aiExplanation: "Matches 3 of 3 required skills (Python, FastAPI, Docker). Has 3 years experience against the 2-year minimum requirement.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-08T10:30:00Z",
    reviewedAt: null,
    managerNotes: ""
  },
  {
    id: "alloc-102",
    employeeId: "emp-3",
    employeeName: "Rohan Verma",
    employeeRole: "DevOps Engineer",
    projectId: "proj-3",
    projectName: "Kubernetes Migration",
    aiMatchScore: 92,
    aiExplanation: "Matches all 4 core technologies (Kubernetes, Docker, AWS, Terraform). 5 years experience exceeds the 4-year project threshold.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-09T08:15:00Z",
    reviewedAt: null,
    managerNotes: ""
  }
];
