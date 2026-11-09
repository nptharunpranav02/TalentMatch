// Enterprise-grade IT Bench & Project Dataset (MAANG & Tier-1 IT Services Standards)
export const initialEmployees = [
  {
    id: "emp-1",
    empCode: "TM-04821",
    name: "Aarav Sharma",
    email: "aarav.sharma@talentmatch.io",
    role: "Full Stack Engineer",
    band: "L4 / SDE-2",
    department: "Enterprise Web Engineering",
    location: "Bengaluru, India",
    experienceYears: 4.2,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-12",
    certifications: ["AWS Certified Developer Associate", "Meta Frontend Certified"],
    skills: [
      { name: "React", proficiency: 4.5, years: 4 },
      { name: "TypeScript", proficiency: 4.0, years: 3 },
      { name: "Node.js", proficiency: 4.0, years: 3.5 },
      { name: "PostgreSQL", proficiency: 3.5, years: 2.5 }
    ],
    careerInterests: ["System Design", "Cloud Architecture", "Distributed Systems"],
    previousProjects: ["Retail Banking Core", "Supply Chain Portal"],
    currentAllocations: []
  },
  {
    id: "emp-2",
    empCode: "TM-03914",
    name: "Priya Patel",
    email: "priya.patel@talentmatch.io",
    role: "AI / ML Solutions Engineer",
    band: "L4 / SDE-2",
    department: "Applied AI & Analytics",
    location: "Hyderabad, India",
    experienceYears: 3.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-05",
    certifications: ["Google Cloud Professional Data Engineer", "DeepLearning.AI LangChain"],
    skills: [
      { name: "Python", proficiency: 5.0, years: 3.5 },
      { name: "FastAPI", proficiency: 4.5, years: 2.5 },
      { name: "PyTorch", proficiency: 4.0, years: 2.0 },
      { name: "Docker", proficiency: 3.5, years: 2.0 }
    ],
    careerInterests: ["Generative AI", "RAG Pipelines", "High-throughput APIs"],
    previousProjects: ["Medical Image Classifier", "Automated Triage Bot"],
    currentAllocations: []
  },
  {
    id: "emp-3",
    empCode: "TM-02911",
    name: "Rohan Verma",
    email: "rohan.verma@talentmatch.io",
    role: "Staff DevOps & SRE Engineer",
    band: "L5 / Senior Engineer",
    department: "Cloud Platform Engineering",
    location: "Pune, India",
    experienceYears: 5.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-09-28",
    certifications: ["CKA (Certified Kubernetes Admin)", "AWS Solutions Architect Professional", "HashiCorp Terraform"],
    skills: [
      { name: "AWS", proficiency: 5.0, years: 5.5 },
      { name: "Kubernetes", proficiency: 4.5, years: 4.0 },
      { name: "Docker", proficiency: 5.0, years: 4.5 },
      { name: "Terraform", proficiency: 4.5, years: 3.5 }
    ],
    careerInterests: ["Platform Engineering", "GitOps", "Zero-Trust Security"],
    previousProjects: ["Fintech Microservices Migration", "Multi-region Failover"],
    currentAllocations: []
  },
  {
    id: "emp-4",
    empCode: "TM-05192",
    name: "Ananya Iyer",
    email: "ananya.iyer@talentmatch.io",
    role: "Frontend Software Engineer",
    band: "L3 / SDE-1",
    department: "Enterprise Web Engineering",
    location: "Bengaluru, India",
    experienceYears: 2.2,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-24",
    certifications: ["React Advanced Certified"],
    skills: [
      { name: "React", proficiency: 4.0, years: 2.0 },
      { name: "Tailwind CSS", proficiency: 4.5, years: 2.0 },
      { name: "JavaScript", proficiency: 4.0, years: 2.2 },
      { name: "Redux", proficiency: 3.5, years: 1.5 }
    ],
    careerInterests: ["Design Systems", "Web Performance", "Micro-frontends"],
    previousProjects: ["E-Commerce Checkout Flow"],
    currentAllocations: []
  },
  {
    id: "emp-5",
    empCode: "TM-01824",
    name: "Vikram Malhotra",
    email: "vikram.m@talentmatch.io",
    role: "Principal Backend Architect",
    band: "L6 / Staff Architect",
    department: "Core Banking & Enterprise Systems",
    location: "Bengaluru, India",
    experienceYears: 7.0,
    availabilityStatus: "ALLOCATED",
    benchSince: null,
    certifications: ["Oracle Certified Master Java", "Confluent Certified Kafka Developer"],
    skills: [
      { name: "Java", proficiency: 5.0, years: 7.0 },
      { name: "Spring Boot", proficiency: 5.0, years: 6.0 },
      { name: "Microservices", proficiency: 5.0, years: 5.5 },
      { name: "Kafka", proficiency: 4.5, years: 4.0 }
    ],
    careerInterests: ["High-Throughput Systems", "Event-driven Architecture"],
    previousProjects: ["UPI Realtime Switch", "Card Authorization Engine"],
    currentAllocations: ["proj-2"]
  },
  {
    id: "emp-6",
    empCode: "TM-04108",
    name: "Sneha Mukherjee",
    email: "sneha.m@talentmatch.io",
    role: "Senior Data & Analytics Specialist",
    band: "L4 / Senior Analyst",
    department: "Applied AI & Analytics",
    location: "Hyderabad, India",
    experienceYears: 3.8,
    availabilityStatus: "BENCH",
    benchSince: "2026-11-01",
    certifications: ["Tableau Desktop Specialist", "Microsoft Azure Data Fundamentals"],
    skills: [
      { name: "Python", proficiency: 4.5, years: 3.5 },
      { name: "SQL", proficiency: 5.0, years: 3.8 },
      { name: "Tableau", proficiency: 4.0, years: 3.0 },
      { name: "Pandas", proficiency: 4.5, years: 3.0 }
    ],
    careerInterests: ["Executive Analytics", "Predictive Modeling", "Snowflake"],
    previousProjects: ["Churn Prediction Model", "Executive BI Portal"],
    currentAllocations: []
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    projectCode: "PRJ-FIN-8021",
    name: "Core Banking & UPI Payments Engine",
    client: "Apex Financial Holdings",
    description: "High-throughput real-time payment gateway handling 15,000 TPS with resilient microservices and dynamic merchant interfaces.",
    domain: "Fintech & Banking",
    engagementModel: "Dedicated Pod (T&M)",
    locationRequirement: "Hybrid - Bengaluru",
    requiredSkills: [
      { name: "React", minProficiency: 4.0, weight: 1.0 },
      { name: "Node.js", minProficiency: 3.5, weight: 0.9 },
      { name: "TypeScript", minProficiency: 3.5, weight: 0.8 },
      { name: "PostgreSQL", minProficiency: 3.0, weight: 0.7 }
    ],
    minExperienceYears: 3.0,
    targetBand: "L4 / SDE-2 or above",
    teamSize: 4,
    allocatedCount: 1,
    status: "OPEN",
    priority: "Critical",
    monthlyRevenuePerDev: 420000, // ₹4,20,000 / month billable billing rate
    deadline: "2027-03-31"
  },
  {
    id: "proj-2",
    projectCode: "PRJ-HLT-4912",
    name: "Clinical Summary & Diagnostic AI Pod",
    client: "HealthCare Plus Global",
    description: "Enterprise clinical documentation pipeline summarizing electronic health records with secure LLMs and medical retrieval vector stores.",
    domain: "Healthcare & Life Sciences",
    engagementModel: "Agile Innovation Team",
    locationRequirement: "Remote / Hyderabad",
    requiredSkills: [
      { name: "Python", minProficiency: 4.0, weight: 1.0 },
      { name: "FastAPI", minProficiency: 3.5, weight: 0.8 },
      { name: "Docker", minProficiency: 3.0, weight: 0.7 }
    ],
    minExperienceYears: 2.5,
    targetBand: "L4 / SDE-2",
    teamSize: 3,
    allocatedCount: 2,
    status: "OPEN",
    priority: "High",
    monthlyRevenuePerDev: 480000, // ₹4,80,000 / month billing rate
    deadline: "2027-04-15"
  },
  {
    id: "proj-3",
    projectCode: "PRJ-LOG-3109",
    name: "AWS Multi-Region Kubernetes Migration",
    client: "LogiTrans Enterprise Logistics",
    description: "Multi-cluster EKS infrastructure overhaul with GitOps pipelines, Terraform IAC, and automated multi-region disaster recovery.",
    domain: "Supply Chain & Cloud Infrastructure",
    engagementModel: "Staff Augmentation",
    locationRequirement: "Pune / Hybrid",
    requiredSkills: [
      { name: "Kubernetes", minProficiency: 4.0, weight: 1.0 },
      { name: "Docker", minProficiency: 4.0, weight: 0.9 },
      { name: "AWS", minProficiency: 4.0, weight: 0.9 },
      { name: "Terraform", minProficiency: 3.5, weight: 0.8 }
    ],
    minExperienceYears: 4.0,
    targetBand: "L5 / Senior Engineer",
    teamSize: 3,
    allocatedCount: 1,
    status: "OPEN",
    priority: "High",
    monthlyRevenuePerDev: 550000, // ₹5,50,000 / month billing rate
    deadline: "2027-06-30"
  }
];

export const initialAllocations = [
  {
    id: "alloc-101",
    employeeId: "emp-2",
    empCode: "TM-03914",
    employeeName: "Priya Patel",
    employeeRole: "AI / ML Solutions Engineer",
    employeeBand: "L4 / SDE-2",
    projectId: "proj-2",
    projectCode: "PRJ-HLT-4912",
    projectName: "Clinical Summary & Diagnostic AI Pod",
    clientName: "HealthCare Plus Global",
    aiMatchScore: 94,
    scoreBreakdown: {
      technicalFit: 55, // out of 60
      experienceFit: 25, // out of 25
      aspirationFit: 14 // out of 15
    },
    aiExplanation: "Matches 3 of 3 core requirements (Python, FastAPI, Docker). Total tenure (3.5y) satisfies project minimum (2.5y). Direct alignment with stated interest in RAG & GenAI.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-08T10:30:00Z",
    reviewedAt: null,
    managerNotes: ""
  },
  {
    id: "alloc-102",
    employeeId: "emp-3",
    empCode: "TM-02911",
    employeeName: "Rohan Verma",
    employeeRole: "Staff DevOps & SRE Engineer",
    employeeBand: "L5 / Senior Engineer",
    projectId: "proj-3",
    projectCode: "PRJ-LOG-3109",
    projectName: "AWS Multi-Region Kubernetes Migration",
    clientName: "LogiTrans Enterprise Logistics",
    aiMatchScore: 92,
    scoreBreakdown: {
      technicalFit: 53,
      experienceFit: 25,
      aspirationFit: 14
    },
    aiExplanation: "Full coverage across AWS, Kubernetes, Docker, and Terraform. Holds CKA and AWS Solutions Architect Professional certifications. 5.5y tenure meets L5 seniority requirement.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-09T08:15:00Z",
    reviewedAt: null,
    managerNotes: ""
  }
];
