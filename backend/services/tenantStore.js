const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");
const TENANTS_FILE = path.join(DATA_DIR, "tenants.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Preset Organizations
const INITIAL_TENANTS = {
  "org-apex": {
    id: "org-apex",
    name: "Apex Financial Global",
    slug: "apex",
    email: "admin@apexfinancial.io",
    password: "password123",
    industry: "Fintech & Banking Systems",
    adminName: "Marcus Vance",
    role: "Enterprise Delivery Director",
    plan: "Tier-1 Dedicated Enterprise Space",
    createdAt: "2026-11-01T00:00:00.000Z",
    employees: [
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
        availableCapacityPercentage: 100,
        benchSince: "2026-10-12",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["AWS Certified Developer Associate", "Meta Frontend Certified"],
        skills: [
          { name: "React", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
          { name: "TypeScript", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.5 },
          { name: "Node.js", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.5 },
          { name: "PostgreSQL", proficiency: 3.5, proficiencyLabel: "Proficient", years: 2.5 }
        ],
        careerInterests: ["System Design", "Cloud Architecture", "Distributed Systems"]
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
        availableCapacityPercentage: 100,
        benchSince: "2026-10-05",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["Google Cloud Professional Data Engineer", "DeepLearning.AI LangChain"],
        skills: [
          { name: "Python", proficiency: 5.0, proficiencyLabel: "Expert", years: 5.0 },
          { name: "FastAPI", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 },
          { name: "PyTorch", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.0 },
          { name: "Docker", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 }
        ],
        careerInterests: ["Generative AI", "RAG Pipelines", "Healthcare & Life Sciences"]
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
        availableCapacityPercentage: 100,
        benchSince: "2026-09-24",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["CKA (Certified Kubernetes Admin)", "AWS Solutions Architect Professional", "HashiCorp Terraform"],
        skills: [
          { name: "AWS", proficiency: 5.0, proficiencyLabel: "Expert", years: 5.5 },
          { name: "Kubernetes", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
          { name: "Docker", proficiency: 5.0, proficiencyLabel: "Expert", years: 4.5 },
          { name: "Terraform", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 }
        ],
        careerInterests: ["Platform Engineering", "GitOps", "Zero-Trust Security"]
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
        availabilityStatus: "ALLOCATED",
        availableCapacityPercentage: 0,
        benchSince: null,
        assignedProjectId: "proj-1",
        assignedProjectName: "Core Banking & UPI Payments Engine",
        allocatedEngagements: [
          {
            projectId: "proj-1",
            projectCode: "PRJ-FIN-8021",
            projectName: "Core Banking & UPI Payments Engine",
            allocationPercentage: 100,
            effectiveStartDate: "2026-11-01"
          }
        ],
        certifications: ["Oracle Certified Master Java", "Confluent Certified Kafka Developer"],
        skills: [
          { name: "Java", proficiency: 5.0, proficiencyLabel: "Expert", years: 8.5 },
          { name: "React", proficiency: 4.0, proficiencyLabel: "Advanced", years: 4.0 },
          { name: "Node.js", proficiency: 4.5, proficiencyLabel: "Expert", years: 5.0 },
          { name: "PostgreSQL", proficiency: 5.0, proficiencyLabel: "Expert", years: 6.0 }
        ],
        careerInterests: ["High-Throughput Systems", "Event-driven Architecture", "Fintech & Banking"]
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
        availableCapacityPercentage: 100,
        benchSince: "2026-11-01",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["Tableau Desktop Specialist", "Microsoft Azure Data Fundamentals"],
        skills: [
          { name: "Python", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.5 },
          { name: "SQL", proficiency: 5.0, proficiencyLabel: "Expert", years: 3.8 },
          { name: "Tableau", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 },
          { name: "Pandas", proficiency: 4.5, proficiencyLabel: "Expert", years: 3.0 }
        ],
        careerInterests: ["Executive Analytics", "Predictive Modeling", "Snowflake"]
      }
    ],
    projects: [
      {
        id: "proj-1",
        projectCode: "PRJ-FIN-8021",
        name: "Core Banking & UPI Payments Engine",
        client: "Apex Financial Global",
        clientContact: "Marcus Thorne (Head of Digital Banking)",
        description: "High-throughput real-time payment gateway handling 15,000 TPS with resilient microservices and distributed ledger audit.",
        domain: "Fintech & Banking",
        requiredSkills: [
          { name: "React", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
          { name: "Node.js", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.9 },
          { name: "TypeScript", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 },
          { name: "PostgreSQL", minProficiency: 3.0, targetLabel: "Proficient", weight: 0.7 }
        ],
        minExperienceYears: 3.0,
        targetBand: "L4 / Senior SDE",
        teamSize: 4,
        allocatedCount: 1,
        allocatedFTE: 1.0,
        assignedEmployeeIds: ["emp-5"],
        status: "OPEN",
        hiringStatus: "Active Hiring",
        priority: "Critical",
        monthlyRevenuePerDev: 14000,
        startDate: "2026-11-01",
        deadline: "2027-03-31"
      }
    ],
    allocations: [
      {
        id: "alloc-seed-1",
        employeeId: "emp-5",
        empCode: "TM-01824",
        employeeName: "Kenji Takahashi",
        employeeRole: "Principal Distributed Systems Architect",
        employeeBand: "L6",
        projectId: "proj-1",
        projectCode: "PRJ-FIN-8021",
        projectName: "Core Banking & UPI Payments Engine",
        clientName: "Apex Financial Global",
        allocationPercentage: 100,
        aiMatchScore: 95,
        status: "APPROVED",
        proposedAt: "2026-11-01T00:00:00.000Z",
        effectiveStartDate: "2026-11-01",
        reviewedAt: "2026-11-01T00:00:00.000Z",
        managerNotes: "Approved as Lead Architect for transaction switch cutover."
      }
    ]
  },

  "org-helix": {
    id: "org-helix",
    name: "Helix Healthcare IT",
    slug: "helix",
    email: "admin@helixhealth.io",
    password: "password123",
    industry: "Clinical Diagnostics & Health AI",
    adminName: "Dr. Evelyn Reed",
    role: "VP Health Informatics",
    plan: "HIPAA Compliant Dedicated Space",
    createdAt: "2026-11-02T00:00:00.000Z",
    employees: [
      {
        id: "emp-h1",
        empCode: "TM-H1021",
        name: "Marcus Vance",
        email: "marcus.vance@helixhealth.io",
        role: "Senior Clinical AI Engineer",
        band: "L4 / Senior SDE",
        department: "Clinical Diagnostic Informatics",
        location: "Austin, United States",
        experienceYears: 4.2,
        availabilityStatus: "BENCH",
        availableCapacityPercentage: 100,
        benchSince: "2026-10-18",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["AWS Certified Machine Learning", "HIPAA Data Security Certified"],
        skills: [
          { name: "Python", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
          { name: "FastAPI", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 },
          { name: "Docker", proficiency: 3.5, proficiencyLabel: "Proficient", years: 2.5 },
          { name: "PyTorch", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.0 }
        ],
        careerInterests: ["Healthcare AI", "EHR Summarization", "FHIR Interoperability"]
      },
      {
        id: "emp-h2",
        empCode: "TM-H2044",
        name: "Dr. Sarah Lin",
        email: "sarah.lin@helixhealth.io",
        role: "Lead Bioinformatician & Data Scientist",
        band: "L5 / Staff AI Scientist",
        department: "Genomics & Clinical Analytics",
        location: "Boston, United States",
        experienceYears: 6.0,
        availabilityStatus: "BENCH",
        availableCapacityPercentage: 100,
        benchSince: "2026-10-22",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["Google Cloud Professional Data Engineer", "HL7 FHIR Certified Specialist"],
        skills: [
          { name: "Python", proficiency: 5.0, proficiencyLabel: "Expert", years: 6.0 },
          { name: "FastAPI", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 },
          { name: "Docker", proficiency: 4.0, proficiencyLabel: "Advanced", years: 3.5 },
          { name: "PyTorch", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 }
        ],
        careerInterests: ["Clinical LLMs", "Diagnostic Decision Support", "HIPAA Cloud"]
      }
    ],
    projects: [
      {
        id: "proj-h1",
        projectCode: "PRJ-HLT-4912",
        name: "Clinical Summary & Diagnostic AI Pod",
        client: "HealthCare Plus Systems",
        clientContact: "Dr. Evelyn Reed (VP Health Informatics)",
        description: "Enterprise clinical documentation pipeline summarizing electronic health records with secure HIPAA-compliant LLMs.",
        domain: "Healthcare & Life Sciences",
        requiredSkills: [
          { name: "Python", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
          { name: "FastAPI", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 },
          { name: "Docker", minProficiency: 3.0, targetLabel: "Proficient", weight: 0.7 }
        ],
        minExperienceYears: 2.5,
        targetBand: "L4 / SDE-2 or higher",
        teamSize: 3,
        allocatedCount: 0,
        allocatedFTE: 0,
        assignedEmployeeIds: [],
        status: "OPEN",
        hiringStatus: "Active Hiring",
        priority: "High",
        monthlyRevenuePerDev: 16000,
        startDate: "2026-10-15",
        deadline: "2027-04-15"
      }
    ],
    allocations: []
  },

  "org-technova": {
    id: "org-technova",
    name: "TechNova Cloud Systems",
    slug: "technova",
    email: "admin@technova.io",
    password: "password123",
    industry: "Enterprise Cloud & Platform Engineering",
    adminName: "Henrik Lindqvist",
    role: "Chief Cloud Architect",
    plan: "Cloud Platforms Dedicated Space",
    createdAt: "2026-11-03T00:00:00.000Z",
    employees: [
      {
        id: "emp-t1",
        empCode: "TM-T5521",
        name: "Maya Patel",
        email: "maya.patel@technova.io",
        role: "Senior Cloud Platform Architect",
        band: "L5 / Senior Infrastructure Engineer",
        department: "Cloud Platform Engineering",
        location: "Seattle, United States",
        experienceYears: 6.5,
        availabilityStatus: "BENCH",
        availableCapacityPercentage: 100,
        benchSince: "2026-10-15",
        assignedProjectId: null,
        assignedProjectName: null,
        allocatedEngagements: [],
        certifications: ["AWS Solutions Architect Professional", "CKA (Kubernetes Administrator)", "HashiCorp Terraform"],
        skills: [
          { name: "AWS", proficiency: 5.0, proficiencyLabel: "Expert", years: 6.0 },
          { name: "Kubernetes", proficiency: 4.8, proficiencyLabel: "Expert", years: 5.0 },
          { name: "Docker", proficiency: 5.0, proficiencyLabel: "Expert", years: 6.0 },
          { name: "Terraform", proficiency: 4.5, proficiencyLabel: "Expert", years: 4.0 }
        ],
        careerInterests: ["Multi-Cloud Mesh", "ArgoCD GitOps", "Zero-Trust Infrastructure"]
      }
    ],
    projects: [
      {
        id: "proj-t1",
        projectCode: "PRJ-LOG-3109",
        name: "Multi-Cloud Kubernetes Migration",
        client: "LogiTrans Enterprise Logistics",
        clientContact: "Henrik Lindqvist (Chief Architect)",
        description: "Multi-cluster EKS/GKE infrastructure overhaul with GitOps pipelines and automated multi-region disaster recovery.",
        domain: "Supply Chain & Cloud Infrastructure",
        requiredSkills: [
          { name: "AWS", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
          { name: "Kubernetes", minProficiency: 4.0, targetLabel: "Advanced", weight: 1.0 },
          { name: "Docker", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 },
          { name: "Terraform", minProficiency: 3.5, targetLabel: "Proficient", weight: 0.8 }
        ],
        minExperienceYears: 3.5,
        targetBand: "L4 / Senior DevOps",
        teamSize: 3,
        allocatedCount: 0,
        allocatedFTE: 0,
        assignedEmployeeIds: [],
        status: "OPEN",
        hiringStatus: "Active Hiring",
        priority: "Normal",
        monthlyRevenuePerDev: 18000,
        startDate: "2026-11-20",
        deadline: "2027-06-30"
      }
    ],
    allocations: []
  }
};

class TenantStore {
  constructor() {
    this.tenants = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(TENANTS_FILE)) {
        const raw = fs.readFileSync(TENANTS_FILE, "utf8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("[TenantStore] Failed to load tenants file, using initial dataset:", err.message);
    }
    // Save initial presets
    this.saveData(INITIAL_TENANTS);
    return JSON.parse(JSON.stringify(INITIAL_TENANTS));
  }

  saveData(data = this.tenants) {
    try {
      fs.writeFileSync(TENANTS_FILE, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("[TenantStore] Failed to write tenants file:", err.message);
    }
  }

  listOrganizations() {
    return Object.values(this.tenants).map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      email: t.email,
      industry: t.industry,
      adminName: t.adminName,
      role: t.role,
      plan: t.plan,
      employeeCount: (t.employees || []).length,
      projectCount: (t.projects || []).length
    }));
  }

  getOrganization(orgId) {
    return this.tenants[orgId] || null;
  }

  authenticate(emailOrSlug, password) {
    const term = (emailOrSlug || "").trim().toLowerCase();
    const org = Object.values(this.tenants).find(
      (t) => t.email.toLowerCase() === term || t.slug.toLowerCase() === term
    );

    if (!org) {
      return { success: false, message: "Organization account not found for this email or workspace slug." };
    }

    if (org.password !== password) {
      return { success: false, message: "Invalid password for this organization workspace." };
    }

    return {
      success: true,
      token: `tm_jwt_${org.id}_${Date.now()}`,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        email: org.email,
        industry: org.industry,
        adminName: org.adminName,
        role: org.role,
        plan: org.plan
      },
      user: {
        id: `user-${org.id}`,
        name: org.adminName || "Workspace Admin",
        email: org.email,
        role: "Organization Administrator"
      }
    };
  }

  registerOrganization({ name, slug, email, password, industry, adminName, seedStarter = false }) {
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-")).trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const exists = Object.values(this.tenants).find(
      (t) => t.email.toLowerCase() === cleanEmail || t.slug.toLowerCase() === cleanSlug
    );
    if (exists) {
      throw new Error(`An organization workspace already exists with email '${cleanEmail}' or slug '${cleanSlug}'.`);
    }

    const orgId = `org-${cleanSlug}-${Date.now().toString().slice(-4)}`;

    const newOrg = {
      id: orgId,
      name: name.trim(),
      slug: cleanSlug,
      email: cleanEmail,
      password: password,
      industry: industry || "Technology & Services",
      adminName: adminName || "Organization Lead",
      role: "Organization Administrator",
      plan: "Dedicated Enterprise Workspace",
      createdAt: new Date().toISOString(),
      employees: seedStarter ? JSON.parse(JSON.stringify(INITIAL_TENANTS["org-apex"].employees)) : [],
      projects: seedStarter ? JSON.parse(JSON.stringify(INITIAL_TENANTS["org-apex"].projects)) : [],
      allocations: []
    };

    this.tenants[orgId] = newOrg;
    this.saveData();

    return {
      id: newOrg.id,
      name: newOrg.name,
      slug: newOrg.slug,
      email: newOrg.email,
      industry: newOrg.industry,
      adminName: newOrg.adminName
    };
  }

  // Employee CRUD Scoped by Tenant
  getEmployees(orgId) {
    const org = this.getOrganization(orgId);
    return org ? (org.employees || []) : [];
  }

  addEmployee(orgId, employeeData) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const newEmp = {
      ...employeeData,
      id: `emp-${Date.now()}`,
      empCode: employeeData.empCode || `TM-${Math.floor(10000 + Math.random() * 90000)}`,
      availabilityStatus: employeeData.availabilityStatus || "BENCH",
      availableCapacityPercentage: employeeData.availabilityStatus === "ALLOCATED" ? 0 : 100,
      benchSince: employeeData.availabilityStatus === "ALLOCATED" ? null : new Date().toISOString().split("T")[0],
      assignedProjectId: null,
      assignedProjectName: null,
      allocatedEngagements: [],
      skills: employeeData.skills || [],
      certifications: employeeData.certifications || [],
      careerInterests: employeeData.careerInterests || []
    };

    org.employees.unshift(newEmp);
    this.saveData();
    return newEmp;
  }

  updateEmployee(orgId, updatedEmployee) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const idx = org.employees.findIndex((e) => e.id === updatedEmployee.id);
    if (idx === -1) throw new Error("Employee not found in this organization");

    org.employees[idx] = { ...org.employees[idx], ...updatedEmployee };
    this.saveData();
    return org.employees[idx];
  }

  deleteEmployee(orgId, employeeId) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const emp = org.employees.find((e) => e.id === employeeId);
    if (!emp) throw new Error("Employee not found");
    if (emp.availabilityStatus === "ALLOCATED") {
      throw new Error(`Cannot delete ${emp.name} while actively allocated to ${emp.assignedProjectName || "a project"}.`);
    }

    org.employees = org.employees.filter((e) => e.id !== employeeId);
    this.saveData();
    return { success: true };
  }

  // Project CRUD Scoped by Tenant
  getProjects(orgId) {
    const org = this.getOrganization(orgId);
    return org ? (org.projects || []) : [];
  }

  addProject(orgId, projectData) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const newProj = {
      ...projectData,
      id: `proj-${Date.now()}`,
      projectCode: projectData.projectCode || `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      allocatedCount: 0,
      allocatedFTE: 0,
      assignedEmployeeIds: [],
      status: "OPEN"
    };

    org.projects.unshift(newProj);
    this.saveData();
    return newProj;
  }

  updateProject(orgId, updatedProject) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const idx = org.projects.findIndex((p) => p.id === updatedProject.id);
    if (idx === -1) throw new Error("Project not found");

    org.projects[idx] = { ...org.projects[idx], ...updatedProject };
    this.saveData();
    return org.projects[idx];
  }

  deleteProject(orgId, projectId) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    // Deallocate any employees
    org.employees.forEach((emp) => {
      if (emp.assignedProjectId === projectId) {
        emp.availabilityStatus = "BENCH";
        emp.availableCapacityPercentage = 100;
        emp.assignedProjectId = null;
        emp.assignedProjectName = null;
        emp.allocatedEngagements = [];
        emp.benchSince = new Date().toISOString().split("T")[0];
      }
    });

    org.projects = org.projects.filter((p) => p.id !== projectId);
    org.allocations = (org.allocations || []).filter((a) => a.projectId !== projectId);
    this.saveData();
    return { success: true };
  }

  // Allocations Scoped by Tenant
  getAllocations(orgId) {
    const org = this.getOrganization(orgId);
    return org ? (org.allocations || []) : [];
  }

  proposeAllocation(orgId, allocData) {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    org.allocations = org.allocations || [];
    org.allocations.unshift(allocData);
    this.saveData();
    return allocData;
  }

  reviewAllocation(orgId, allocationId, decision, managerNotes = "") {
    const org = this.getOrganization(orgId);
    if (!org) throw new Error("Organization workspace not found");

    const alloc = (org.allocations || []).find((a) => a.id === allocationId);
    if (!alloc) throw new Error("Allocation not found");

    alloc.status = decision;
    alloc.reviewedAt = new Date().toISOString();
    if (managerNotes) alloc.managerNotes = managerNotes;

    const emp = org.employees.find((e) => e.id === alloc.employeeId);
    const proj = org.projects.find((p) => p.id === alloc.projectId);

    if (decision === "APPROVED" && emp && proj) {
      const pct = alloc.allocationPercentage || 100;
      const currentCap = emp.availableCapacityPercentage ?? 100;
      const newCap = Math.max(0, currentCap - pct);
      emp.availableCapacityPercentage = newCap;
      emp.availabilityStatus = newCap === 0 ? "ALLOCATED" : "PARTIAL_BENCH";
      emp.allocatedEngagements = emp.allocatedEngagements || [];
      emp.allocatedEngagements.push({
        projectId: proj.id,
        projectCode: proj.projectCode,
        projectName: proj.name,
        clientName: proj.client,
        allocationPercentage: pct,
        effectiveStartDate: alloc.effectiveStartDate,
        allocationId: alloc.id
      });
      emp.assignedProjectId = proj.id;
      emp.assignedProjectName = emp.allocatedEngagements.map((e) => `${e.projectName} (${e.allocationPercentage}%)`).join(", ");
      if (newCap === 0) emp.benchSince = null;
    }

    this.saveData();
    return alloc;
  }
}

const tenantStore = new TenantStore();
module.exports = tenantStore;
