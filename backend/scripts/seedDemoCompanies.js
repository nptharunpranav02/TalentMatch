require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("autoIndex", false);
const connectDB = require("../config/db");
const Company = require("../models/Company");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Project = require("../models/Project");
const Allocation = require("../models/Allocation");

const demoCompanies = [
  {
    name: "Northstar Digital",
    slug: "northstar-digital",
    industry: "Digital Product Engineering",
    admin: { name: "Aarav Mehta", email: "admin@northstar.test", password: "Northstar@123" },
    employees: [
      { employeeId: "NS-101", name: "Riya Sharma", email: "riya@northstar.test", department: "Engineering", designation: "Frontend Engineer", skills: [{ name: "React", proficiency: 5 }, { name: "JavaScript", proficiency: 5 }], experience: 4 },
      { employeeId: "NS-102", name: "Kabir Rao", email: "kabir@northstar.test", department: "Engineering", designation: "Backend Engineer", skills: [{ name: "Node.js", proficiency: 5 }, { name: "MongoDB", proficiency: 4 }], experience: 5 }
    ],
    project: { projectId: "NS-PROJ-01", projectName: "Customer Experience Portal", description: "Build a modern customer self-service portal.", requiredSkills: [{ name: "React", proficiency: 4 }, { name: "JavaScript", proficiency: 4 }], minExperience: 3, teamSize: 4, client: "Northstar Retail", domain: "Retail", priority: "High" }
  },
  {
    name: "BluePeak Technologies",
    slug: "bluepeak-technologies",
    industry: "Cloud & Enterprise Software",
    admin: { name: "Ananya Iyer", email: "admin@bluepeak.test", password: "BluePeak@123" },
    employees: [
      { employeeId: "BP-201", name: "Dev Patel", email: "dev@bluepeak.test", department: "Platform", designation: "Cloud Engineer", skills: [{ name: "AWS", proficiency: 5 }, { name: "Docker", proficiency: 4 }], experience: 6 },
      { employeeId: "BP-202", name: "Meera Nair", email: "meera@bluepeak.test", department: "Engineering", designation: "API Developer", skills: [{ name: "Python", proficiency: 5 }, { name: "FastAPI", proficiency: 4 }], experience: 3 }
    ],
    project: { projectId: "BP-PROJ-01", projectName: "Cloud Migration Program", description: "Modernize workloads and migrate services to cloud infrastructure.", requiredSkills: [{ name: "AWS", proficiency: 4 }, { name: "Docker", proficiency: 3 }], minExperience: 3, teamSize: 5, client: "BluePeak Finance", domain: "Cloud", priority: "Critical" }
  },
  {
    name: "Greenfield Analytics",
    slug: "greenfield-analytics",
    industry: "Data & AI",
    admin: { name: "Ishaan Verma", email: "admin@greenfield.test", password: "Greenfield@123" },
    employees: [
      { employeeId: "GF-301", name: "Sana Khan", email: "sana@greenfield.test", department: "AI", designation: "ML Engineer", skills: [{ name: "Python", proficiency: 5 }, { name: "Machine Learning", proficiency: 5 }], experience: 4 },
      { employeeId: "GF-302", name: "Arjun Das", email: "arjun@greenfield.test", department: "Data", designation: "Data Engineer", skills: [{ name: "SQL", proficiency: 5 }, { name: "Python", proficiency: 4 }], experience: 5 }
    ],
    project: { projectId: "GF-PROJ-01", projectName: "Predictive Insights Engine", description: "Develop predictive analytics and decision support capabilities.", requiredSkills: [{ name: "Python", proficiency: 4 }, { name: "Machine Learning", proficiency: 4 }], minExperience: 3, teamSize: 4, client: "Greenfield Health", domain: "AI & Analytics", priority: "High" }
  }
];

async function seed() {
  await connectDB();
  // Replace legacy global unique indexes with company-scoped unique indexes.
  for (const [collection, index] of [["employees", "employeeId_1"], ["employees", "email_1"], ["projects", "projectId_1"]]) {
    try { await mongoose.connection.collection(collection).dropIndex(index); }
    catch (error) { if (error.codeName !== "IndexNotFound" && error.code !== 27 && error.codeName !== "NamespaceNotFound" && error.code !== 26) throw error; }
  }

  for (const item of demoCompanies) {
    const company = await Company.findOneAndUpdate(
      { slug: item.slug },
      { $set: { name: item.name, industry: item.industry, isDemo: true } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    let admin = await User.findOne({ email: item.admin.email });
    if (!admin) {
      admin = await User.create({ ...item.admin, role: "admin", companyId: company._id });
    } else {
      admin.name = item.admin.name;
      admin.role = "admin";
      admin.companyId = company._id;
      admin.password = item.admin.password;
      await admin.save();
    }

    for (const employee of item.employees) {
      await Employee.findOneAndUpdate(
        { companyId: company._id, employeeId: employee.employeeId },
        { $set: { ...employee, companyId: company._id, availability: "available", band: "L3 / Senior", location: "Bengaluru", certifications: [], careerInterests: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
      );
    }

    const projectStart = new Date();
    projectStart.setDate(projectStart.getDate() - 7);
    const projectEnd = new Date();
    projectEnd.setDate(projectEnd.getDate() + 120);
    await Project.findOneAndUpdate(
      { companyId: company._id, projectId: item.project.projectId },
      { $set: { ...item.project, companyId: company._id, startDate: projectStart, endDate: projectEnd, status: "active", createdBy: admin._id } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    console.log(`Seeded ${company.name}: ${item.admin.email}`);
  }

  // Keep any records from the original single-company prototype together in the first demo workspace.
  const legacyCompany = await Company.findOne({ slug: demoCompanies[0].slug });
  await User.collection.updateMany({ companyId: { $exists: false } }, { $set: { companyId: legacyCompany._id } });
  await Employee.collection.updateMany({ companyId: { $exists: false } }, { $set: { companyId: legacyCompany._id } });
  await Project.collection.updateMany({ companyId: { $exists: false } }, { $set: { companyId: legacyCompany._id } });
  await mongoose.connection.collection("allocations").updateMany({ companyId: { $exists: false } }, { $set: { companyId: legacyCompany._id } });

  await Promise.all([Company.createIndexes(), User.createIndexes(), Employee.createIndexes(), Project.createIndexes(), Allocation.createIndexes()]);
  console.log("\nDemo workspaces ready. All demo passwords are for local prototype demonstration only.");
}

seed().catch(error => { console.error("Demo seed failed:", error); process.exitCode = 1; })
  .finally(async () => { await mongoose.disconnect(); });
