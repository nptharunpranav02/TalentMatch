import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPortal from "./pages/AuthPortal";
import EditEmployeeModal from "./components/EditEmployeeModal";
import EditProjectModal from "./components/EditProjectModal";
import DemoTestingDrawer from "./components/DemoTestingDrawer";
import Analytics from "./pages/Analytics";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import AIMatching from "./pages/AIMatching";
import Approvals from "./pages/Approvals";
import AddEmployeeModal from "./components/AddEmployeeModal";
import AddProjectModal from "./components/AddProjectModal";
import CandidateDrawer from "./components/CandidateDrawer";
import EmployeeDossierModal from "./components/EmployeeDossierModal";
import CandidateCompareModal from "./components/CandidateCompareModal";
import CommandPalette from "./components/CommandPalette";
import ConfirmActionModal from "./components/ConfirmActionModal";
import { api } from "./services/api";
import { liveSync } from "./services/websocket";
import { OrgProvider } from "./context/OrgContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("TalentMatch Error caught by ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-lg p-6 bg-white rounded-2xl border border-rose-200 shadow-xl space-y-3">
            <h2 className="text-base font-extrabold text-rose-700">Application Error Encountered</h2>
            <pre className="text-left text-xs p-3 bg-slate-100 rounded-xl overflow-auto text-slate-800 font-mono">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function TalentMatchMain() {
  const [isWsConnected, setIsWsConnected] = useState(false);
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

  // Modals & Drawers (Hackathon Winners)
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [drawerEmployee, setDrawerEmployee] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null); // { type: 'employee'|'project', data }
  const [compareModalData, setCompareModalData] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const [s, emps, projs, allocs] = await Promise.all([
        api.getDashboardStats(),
        api.getEmployees(),
        api.getProjects(),
        api.getAllocations()
      ]);
      setStats(s || {
        totalEmployees: 0,
        benchCount: 0,
        allocatedCount: 0,
        totalProjects: 0,
        activeProjects: 0,
        pendingApprovals: 0
      });
      setEmployees(emps || []);
      setProjects(projs || []);
      setAllocations(allocs || []);
    } catch (err) {
      console.error("Error loading application data", err);
    }
  };

  useEffect(() => {
    loadAllData();
    liveSync.connect();
    const unsubStatus = liveSync.onStatusChange((status) => {
      setIsWsConnected(status);
    });
    const unsubEvent = liveSync.onEvent((event) => {
      console.log("[TalentMatch LiveSync] Reactive remote update received:", event);
      loadAllData();
    });
    return () => {
      unsubStatus();
      unsubEvent();
    };
  }, []);

  const handleEmployeeAdded = async (newEmp) => {
    await api.addEmployee(newEmp);
    await loadAllData();
  };

  const handleProjectAdded = async (newProj) => {
    await api.addProject(newProj);
    await loadAllData();
  };

  const handleSaveEmployee = async (updatedEmp) => {
    await api.updateEmployee(updatedEmp);
    await loadAllData();
  };

  const handleDeleteEmployee = async (emp) => {
    try {
      await api.deleteEmployee(emp.id);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveProject = async (updatedProj) => {
    await api.updateProject(updatedProj);
    await loadAllData();
  };

  const handleDeleteProject = async (proj) => {
    try {
      await api.deleteProject(proj.id);
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };


  const handleSelectCompare = (chosenCandidate) => {
    api.proposeAllocation({
      employeeId: chosenCandidate.employee.id,
      projectId: compareModalData.project.id,
      aiMatchScore: chosenCandidate.aiMatchScore,
      scoreBreakdown: chosenCandidate.scoreBreakdown,
      aiExplanation: chosenCandidate.aiExplanation
    }).then(() => {
      loadAllData();
      setActiveTab("approvals");
    });
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const pendingApprovalsCount = (allocations || []).filter(
    (a) => a.status === "PENDING_APPROVAL"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={pendingApprovalsCount}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onRefreshData={loadAllData}
        onOpenDemoDrawer={() => setIsDemoDrawerOpen(true)}
        isWsConnected={isWsConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        

        
        {activeTab === "dashboard" && (
          <Dashboard
            stats={stats}
            employees={employees}
            projects={projects}
            allocations={allocations}
            setActiveTab={setActiveTab}
            setSelectedProjectForMatch={setSelectedProjectForMatch}
            onSelectEmployee={(emp) => setDrawerEmployee(emp)}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            onOpenAddProject={() => setIsAddProjectOpen(true)}
            onSelectEmployee={(emp) => setDrawerEmployee(emp)}
          />
        )}

        {activeTab === "employees" && (
          <Employees
            employees={employees}
            onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
            setActiveTab={setActiveTab}
            onSelectEmployee={(emp) => setDrawerEmployee(emp)}
            onEditEmployee={(emp) => setEditingEmployee(emp)}
            onDeleteEmployee={(emp) => setDeleteConfirmTarget({ type: "employee", data: emp })}
          />
        )}

        {activeTab === "projects" && (
          <Projects
            projects={projects}
            employees={employees}
            onOpenAddProject={() => setIsAddProjectOpen(true)}
            setActiveTab={setActiveTab}
            setSelectedProjectForMatch={setSelectedProjectForMatch}
            onSelectEmployee={(emp) => setDrawerEmployee(emp)}
            onEditProject={(proj) => setEditingProject(proj)}
            onDeleteProject={(proj) => setDeleteConfirmTarget({ type: "project", data: proj })}
          />
        )}

        {activeTab === "matching" && (
          <AIMatching
            projects={projects}
            selectedProjectId={selectedProjectForMatch}
            setSelectedProjectId={setSelectedProjectForMatch}
            setActiveTab={setActiveTab}
            onAllocationProposed={loadAllData}
            onOpenCandidateDrawer={(emp) => setDrawerEmployee(emp)}
            onOpenCompareModal={(proj, a, b) => setCompareModalData({ project: proj, candidateA: a, candidateB: b })}
          />
        )}

        {activeTab === "approvals" && (
          <Approvals
            allocations={allocations}
            setActiveTab={setActiveTab}
            onAllocationReviewed={loadAllData}
          />
        )}

        {activeTab === "analytics" && (
          <Analytics
            stats={stats}
            employees={employees}
            projects={projects}
            allocations={allocations}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-800">TalentMatch</strong> — Enterprise Bench & Project Allocation Platform
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Press <kbd className="px-1 py-0.5 text-[10px] bg-slate-100 border border-slate-200 rounded font-semibold text-slate-600">Ctrl+K</kbd> for Command Menu</span>
            <span>•</span>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Reset Data
            </button>
          </div>
        </div>
      </footer>

      {/* 3.1: Enterprise Employee Dossier Modal */}
      <EmployeeDossierModal
        employee={drawerEmployee}
        isOpen={Boolean(drawerEmployee)}
        onClose={() => setDrawerEmployee(null)}
        onSelectProjectForMatch={(projId) => {
          setSelectedProjectForMatch(projId);
          setActiveTab("matching");
        }}
      />

      {/* Head-to-Head Compare Modal */}
      <CandidateCompareModal
        isOpen={Boolean(compareModalData)}
        onClose={() => setCompareModalData(null)}
        project={compareModalData?.project}
        candidateA={compareModalData?.candidateA}
        candidateB={compareModalData?.candidateB}
        onSelectCandidate={handleSelectCompare}
      />

      {/* Quick Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={setIsCommandPaletteOpen}
        employees={employees}
        projects={projects}
        setActiveTab={setActiveTab}
        setSelectedProjectForMatch={setSelectedProjectForMatch}
        onSelectEmployee={(emp) => setDrawerEmployee(emp)}
      />

      {/* Standard Modals */}
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

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={Boolean(editingEmployee)}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
        onSaveEmployee={handleSaveEmployee}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        project={editingProject}
        onSaveProject={handleSaveProject}
      />

      {/* Generic Delete Confirmation Modal */}
      <ConfirmActionModal
        isOpen={Boolean(deleteConfirmTarget)}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={() => {
          if (deleteConfirmTarget?.type === "employee") {
            handleDeleteEmployee(deleteConfirmTarget.data);
          } else if (deleteConfirmTarget?.type === "project") {
            handleDeleteProject(deleteConfirmTarget.data);
          }
          setDeleteConfirmTarget(null);
        }}
        title={deleteConfirmTarget?.type === "employee" ? "Delete Employee Record" : "Delete Project SOW"}
        message={
          deleteConfirmTarget?.type === "employee"
            ? `Are you sure you want to permanently delete ${deleteConfirmTarget?.data?.name} (${deleteConfirmTarget?.data?.empCode}) from the workforce talent directory?`
            : `Are you sure you want to delete ${deleteConfirmTarget?.data?.name} (${deleteConfirmTarget?.data?.projectCode})? Any allocated engineers will be returned to the bench.`
        }
        confirmText="Confirm Delete"
        variant="danger"
      />
          {/* 4.11: Confirmation Dialog for Enterprise Reset */}
      <ConfirmActionModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset Enterprise Telemetry & SOW Data"
        message="This will clear your local allocations and reload the canonical IT dataset (8 Engineers, 6 Bench, 2 Allocated, 3 SOWs). Are you sure?"
        confirmText="Reset to Canonical State"
        variant="warning"
      />

      {/* Developer & Demo Testing Drawer (Separate Evaluation Area) */}
      <DemoTestingDrawer
        isOpen={isDemoDrawerOpen}
        onClose={() => setIsDemoDrawerOpen(false)}
        onSelectProjectForMatch={(projId) => {
          setSelectedProjectForMatch(projId);
          setActiveTab("matching");
        }}
        setActiveTab={setActiveTab}
        onRefreshData={loadAllData}
        onResetData={handleResetData}
      />
    </div>
  );
}

function AppRoot() {
  const { isAuthenticated, isLoading, currentOrg } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white text-xs font-bold font-sans">
        <div className="flex items-center gap-3 bg-slate-800/80 px-5 py-3 rounded-2xl border border-slate-700 shadow-xl">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Connecting to Dedicated Organization Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPortal />;
  }

  return <TalentMatchMain key={currentOrg?.id || "default"} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrgProvider>
          <AppRoot />
        </OrgProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
