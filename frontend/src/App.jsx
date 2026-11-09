import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import AIMatching from "./pages/AIMatching";
import Approvals from "./pages/Approvals";
import AddEmployeeModal from "./components/AddEmployeeModal";
import AddProjectModal from "./components/AddProjectModal";
import { api } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalEmployees: 0,
    benchCount: 0,
    allocatedCount: 0,
    totalProjects: 0,
    activeProjects: 0,
    pendingApprovals: 0
  });
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedProjectForMatch, setSelectedProjectForMatch] = useState(null);

  // Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const [s, emps, projs, allocs] = await Promise.all([
        api.getDashboardStats(),
        api.getEmployees(),
        api.getProjects(),
        api.getAllocations()
      ]);
      setStats(s);
      setEmployees(emps);
      setProjects(projs);
      setAllocations(allocs);
    } catch (err) {
      console.error("Error loading application data", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleEmployeeAdded = async (newEmp) => {
    await api.addEmployee(newEmp);
    await loadAllData();
  };

  const handleProjectAdded = async (newProj) => {
    await api.addProject(newProj);
    await loadAllData();
  };

  const pendingApprovalsCount = allocations.filter(
    (a) => a.status === "PENDING_APPROVAL"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingApprovalsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            stats={stats}
            employees={employees}
            projects={projects}
            allocations={allocations}
            setActiveTab={setActiveTab}
            setSelectedProjectForMatch={setSelectedProjectForMatch}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            onOpenAddProject={() => setIsAddProjectOpen(true)}
          />
        )}

        {activeTab === "employees" && (
          <Employees
            employees={employees}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "projects" && (
          <Projects
            projects={projects}
            onOpenAddProject={() => setIsAddProjectOpen(true)}
            setActiveTab={setActiveTab}
            setSelectedProjectForMatch={setSelectedProjectForMatch}
          />
        )}

        {activeTab === "matching" && (
          <AIMatching
            projects={projects}
            selectedProjectId={selectedProjectForMatch}
            setSelectedProjectId={setSelectedProjectForMatch}
            onAllocationProposed={loadAllData}
          />
        )}

        {activeTab === "approvals" && (
          <Approvals
            allocations={allocations}
            onAllocationReviewed={loadAllData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-800">TalentMatch</strong> — Intelligent Employee & Project Allocation System (PS-02)
          </p>
          <p className="text-slate-400">
            Frontend MVP Built with React, Tailwind CSS & Lucide Icons
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
}
