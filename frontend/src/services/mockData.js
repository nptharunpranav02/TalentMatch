// Global Universal Enterprise Dataset (Adaptable to any IT / Tech enterprise worldwide)
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
    name: "Elena Rostova",
    email: "elena.rostova@talentmatch.io",
    role: "Lead AI & ML Solutions Engineer",
    band: "L5 / Staff AI Engineer",
    department: "Applied AI & Machine Learning",
    location: "Berlin, Germany",
    experienceYears: 4.0,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-05",
    certifications: ["Google Cloud Professional Data Engineer", "DeepLearning.AI LangChain"],
    skills: [
      { name: "Python", proficiency: 5.0, years: 4.0 },
      { name: "FastAPI", proficiency: 4.5, years: 3.0 },
      { name: "PyTorch", proficiency: 4.5, years: 2.5 },
      { name: "Docker", proficiency: 4.0, years: 2.5 }
    ],
    careerInterests: ["Generative AI", "RAG Pipelines", "High-throughput APIs"],
    previousProjects: ["Medical Image Classifier", "Automated Triage Bot"],
    currentAllocations: []
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
    name: "Sarah Jenkins",
    email: "sarah.jenkins@talentmatch.io",
    role: "Frontend Software Engineer",
    band: "L3 / Software Engineer",
    department: "Enterprise Web Engineering",
    location: "San Francisco, United States",
    experienceYears: 2.5,
    availabilityStatus: "BENCH",
    benchSince: "2026-10-24",
    certifications: ["React Advanced Certified", "AWS Cloud Practitioner"],
    skills: [
      { name: "React", proficiency: 4.5, years: 2.5 },
      { name: "Tailwind CSS", proficiency: 5.0, years: 2.5 },
      { name: "JavaScript", proficiency: 4.0, years: 2.5 },
      { name: "Redux", proficiency: 3.5, years: 1.5 }
    ],
    careerInterests: ["Design Systems", "Web Performance", "Micro-frontends"],
    previousProjects: ["SaaS Billing Dashboard"],
    currentAllocations: []
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
    experienceYears: 7.5,
    availabilityStatus: "ALLOCATED",
    benchSince: null,
    certifications: ["Oracle Certified Master Java", "Confluent Certified Kafka Developer"],
    skills: [
      { name: "Java", proficiency: 5.0, years: 7.5 },
      { name: "Spring Boot", proficiency: 5.0, years: 6.5 },
      { name: "Microservices", proficiency: 5.0, years: 6.0 },
      { name: "Kafka", proficiency: 4.5, years: 4.5 }
    ],
    careerInterests: ["High-Throughput Systems", "Event-driven Architecture"],
    previousProjects: ["High-Frequency Payment Switch", "Card Authorization Engine"],
    currentAllocations: ["proj-2"]
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
    client: "Apex Financial Global",
    description: "High-throughput real-time payment gateway handling 15,000 TPS with resilient microservices and dynamic merchant interfaces.",
    domain: "Fintech & Banking",
    engagementModel: "Dedicated Pod (T&M)",
    locationRequirement: "Global Remote / Hybrid",
    requiredSkills: [
      { name: "React", minProficiency: 4.0, weight: 1.0 },
      { name: "Node.js", minProficiency: 3.5, weight: 0.9 },
      { name: "TypeScript", minProficiency: 3.5, weight: 0.8 },
      { name: "PostgreSQL", minProficiency: 3.0, weight: 0.7 }
    ],
    minExperienceYears: 3.0,
    targetBand: "L4 / Senior SDE",
    teamSize: 4,
    allocatedCount: 1,
    status: "OPEN",
    priority: "Critical",
    monthlyRevenuePerDev: 14000, // $14,000 USD / month base billing rate
    deadline: "2027-03-31"
  },
  {
    id: "proj-2",
    projectCode: "PRJ-HLT-4912",
    name: "Clinical Summary & Diagnostic AI Pod",
    client: "HealthCare Plus Systems",
    description: "Enterprise clinical documentation pipeline summarizing electronic health records with secure LLMs and medical retrieval vector stores.",
    domain: "Healthcare & Life Sciences",
    engagementModel: "Agile Innovation Team",
    locationRequirement: "Remote (Global)",
    requiredSkills: [
      { name: "Python", minProficiency: 4.0, weight: 1.0 },
      { name: "FastAPI", minProficiency: 3.5, weight: 0.8 },
      { name: "Docker", minProficiency: 3.0, weight: 0.7 }
    ],
    minExperienceYears: 2.5,
    targetBand: "L4 / SDE-2 or higher",
    teamSize: 3,
    allocatedCount: 2,
    status: "OPEN",
    priority: "High",
    monthlyRevenuePerDev: 16000, // $16,000 USD / month base billing rate
    deadline: "2027-04-15"
  },
  {
    id: "proj-3",
    projectCode: "PRJ-LOG-3109",
    name: "Multi-Cloud Kubernetes Migration",
    client: "LogiTrans Enterprise Logistics",
    description: "Multi-cluster EKS/GKE infrastructure overhaul with GitOps pipelines, Terraform IAC, and automated multi-region disaster recovery.",
    domain: "Supply Chain & Cloud Infrastructure",
    engagementModel: "Staff Augmentation",
    locationRequirement: "EMEA / APAC Remote",
    requiredSkills: [
      { name: "Kubernetes", minProficiency: 4.0, weight: 1.0 },
      { name: "Docker", minProficiency: 4.0, weight: 0.9 },
      { name: "AWS", minProficiency: 4.0, weight: 0.9 },
      { name: "Terraform", minProficiency: 3.5, weight: 0.8 }
    ],
    minExperienceYears: 4.0,
    targetBand: "L5 / Senior Infrastructure",
    teamSize: 3,
    allocatedCount: 1,
    status: "OPEN",
    priority: "High",
    monthlyRevenuePerDev: 18000, // $18,000 USD / month base billing rate
    deadline: "2027-06-30"
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
    aiMatchScore: 95,
    scoreBreakdown: {
      technicalFit: 56,
      experienceFit: 25,
      aspirationFit: 14
    },
    aiExplanation: "Matches 3 of 3 core competencies (Python, FastAPI, Docker). 4.0y verified tenure satisfies project threshold (2.5y). Direct alignment with stated career focus in RAG & GenAI pipelines.",
    status: "PENDING_APPROVAL",
    proposedAt: "2026-11-08T10:30:00Z",
    reviewedAt: null,
    managerNotes: ""
  },
  {
    id: "alloc-102",
    employeeId: "emp-3",
    empCode: "TM-02911",
    employeeName: "David Okafor",
    employeeRole: "Staff DevOps & SRE Engineer",
    employeeBand: "L5 / Senior Infrastructure Engineer",
    projectId: "proj-3",
    projectCode: "PRJ-LOG-3109",
    projectName: "Multi-Cloud Kubernetes Migration",
    clientName: "LogiTrans Enterprise Logistics",
    aiMatchScore: 93,
    scoreBreakdown: {
      technicalFit: 54,
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
