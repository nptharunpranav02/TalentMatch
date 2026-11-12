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
import CandidateCompareModal from "./components/CandidateCompareModal";
import CommandPalette from "./components/CommandPalette";
import { api, getAuthToken, getCurrentUser, clearAuth } from "./services/api";
import { OrgProvider } from "./context/OrgContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }
  handleReset = () => {
    clearAuth();
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md p-6 bg-white rounded-xl border border-slate-200 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900">Enterprise Schema Synchronized</h2>
            <p className="text-xs text-slate-500">
              Your browser has an older session cached. Click below to load the latest enterprise datasets.
            </p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs cursor-pointer"
            >
              Load Latest Dataset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const demoAccounts = [
    { company: "Northstar Digital", email: "admin@northstar.test", password: "Northstar@123" },
    { company: "BluePeak Technologies", email: "admin@bluepeak.test", password: "BluePeak@123" },
    { company: "Greenfield Analytics", email: "admin@greenfield.test", password: "Greenfield@123" }
  ];
  const useDemoAccount = (account) => { setEmail(account.email); setPassword(account.password); setError(""); };
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try { await api.login(email, password); onLogin(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-5">
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl space-y-4">
          <div className="text-2xl font-black text-slate-900">TalentMatch</div>
          <p className="text-sm text-slate-500">Sign in with your company admin credentials. Your workspace is assigned automatically.</p>
          <label className="block text-xs font-bold text-slate-700">Email
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          <label className="block text-xs font-bold text-slate-700">Password
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2" />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button disabled={busy} className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-bold disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 text-white space-y-3">
          <div>
            <p className="text-sm font-bold">Demo company accounts</p>
            <p className="text-xs text-slate-400">Select an account to fill the login form. These are local prototype credentials, not real mailboxes.</p>
          </div>
          {demoAccounts.map(account => (
            <button key={account.email} type="button" onClick={() => useDemoAccount(account)} className="w-full flex items-center justify-between gap-3 rounded-lg border border-slate-700 hover:border-blue-400 hover:bg-slate-800 px-3 py-2.5 text-left">
              <span><span className="block text-sm font-semibold">{account.company}</span><span className="block text-xs text-slate-400">{account.email}</span></span>
              <span className="text-xs font-semibold text-blue-300">Use login</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TalentMatchMain() {
  const currentUser = getCurrentUser();
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
  const [compareModalData, setCompareModalData] = useState(null);

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
  }, []);

  const handleEmployeeAdded = async (newEmp) => {
    await api.addEmployee(newEmp);
    await loadAllData();
  };

  const handleProjectAdded = async (newProj) => {
    await api.addProject(newProj);
    await loadAllData();
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

  const handleResetData = async () => {
    await loadAllData();
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
        currentUser={currentUser}
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
          />
        )}

        {activeTab === "projects" && (
          <Projects
            projects={projects}
            employees={employees}
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
            onOpenCandidateDrawer={(emp) => setDrawerEmployee(emp)}
            onOpenCompareModal={(proj, a, b) => setCompareModalData({ project: proj, candidateA: a, candidateB: b })}
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
      <footer className="border-t border-slate-200 bg-white py-5 mt-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            <strong className="text-slate-800">TalentMatch</strong> — Enterprise Bench & Project Allocation Platform
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Press <kbd className="px-1 py-0.5 text-[10px] bg-slate-100 border border-slate-200 rounded font-semibold text-slate-600">Ctrl+K</kbd> for Command Menu</span>
            <span>•</span>
            <button onClick={() => { clearAuth(); window.location.reload(); }} className="text-slate-500 hover:text-slate-800 underline cursor-pointer">Sign out</button>
            <button
              onClick={handleResetData}
              className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </footer>

      {/* Slide-over Profile Drawer */}
      <CandidateDrawer
        employee={drawerEmployee}
        isOpen={Boolean(drawerEmployee)}
        onClose={() => setDrawerEmployee(null)}
        onMatchProject={() => {
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
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAuthToken()));
  const [authChecking, setAuthChecking] = useState(Boolean(getAuthToken()));
  useEffect(() => { if (!getAuthToken()) { setAuthChecking(false); return; } api.me().then(() => setAuthenticated(true)).catch(() => { clearAuth(); setAuthenticated(false); }).finally(() => setAuthChecking(false)); }, []);
  if (authChecking) return <div className="min-h-screen grid place-items-center">Checking session…</div>;
  if (!authenticated) return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  return (
    <ErrorBoundary>
      <OrgProvider>
        <TalentMatchMain />
      </OrgProvider>
    </ErrorBoundary>
  );
}
