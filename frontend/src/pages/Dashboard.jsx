import React from "react";
import { Users, Briefcase, Sparkles, CheckSquare, Clock, ArrowRight, UserPlus, FolderPlus, TrendingDown, CheckCircle2 } from "lucide-react";

export default function Dashboard({ stats, employees, projects, allocations, setActiveTab, setSelectedProjectForMatch, onOpenAddEmployee, onOpenAddProject }) {
  const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
  const openProjects = projects.filter((p) => p.status === "OPEN");
  const pendingApprovals = allocations.filter((a) => a.status === "PENDING_APPROVAL");

  const benchPercentage = stats.totalEmployees > 0 
    ? Math.round((stats.benchCount / stats.totalEmployees) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Driven Workforce Optimization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Intelligent Bench & Project Allocation System
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Automatically discover the best-fit employees on the bench, match by technical depth and career goals, and dispatch approvals in seconds.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("matching")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-semibold shadow-md shadow-indigo-900/50 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Run AI Matcher
            </button>
            <button
              onClick={onOpenAddEmployee}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              Register Employee
            </button>
            <button
              onClick={onOpenAddProject}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/10 transition-all cursor-pointer"
            >
              <FolderPlus className="h-4 w-4" />
              Create Project
            </button>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bench Employees */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="group p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Bench Employees</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.benchCount}</span>
            <span className="text-xs text-amber-600 font-medium">({benchPercentage}% of total)</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Unassigned talent ready for deployment</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-1 transition-transform">
            <span>View bench list</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Allocated Talent */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="group p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Allocated Staff</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.allocatedCount}</span>
            <span className="text-xs text-emerald-600 font-medium">active billing</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Actively working on client projects</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
            <span>Explore team roster</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Active Projects */}
        <div 
          onClick={() => setActiveTab("projects")}
          className="group p-5 rounded-2xl bg-white border border-indigo-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">Open Projects</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.activeProjects}</span>
            <span className="text-xs text-slate-500 font-medium">of {stats.totalProjects} total</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Currently sourcing engineers</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-indigo-700 group-hover:translate-x-1 transition-transform">
            <span>Review requirements</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div 
          onClick={() => setActiveTab("approvals")}
          className="group p-5 rounded-2xl bg-white border border-rose-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Manager Approvals</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.pendingApprovals}</span>
            <span className="text-xs text-rose-600 font-medium">Action required</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">AI-suggested allocations awaiting sign-off</p>
          <div className="mt-3 flex items-center text-xs font-semibold text-rose-700 group-hover:translate-x-1 transition-transform">
            <span>Open approval queue</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Bench List & Open Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench Talent Priority List */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Priority Bench Talent</h2>
              <p className="text-xs text-slate-500">Employees currently unassigned who need project placement</p>
            </div>
            <button
              onClick={() => setActiveTab("employees")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({benchEmployees.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {benchEmployees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{emp.name}</p>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Bench
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{emp.role} • {emp.experienceYears}y exp</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {emp.skills.slice(0, 3).map((s) => (
                      <span key={s.name} className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-700 font-medium">
                        {s.name}
                      </span>
                    ))}
                    {emp.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 text-slate-500">
                        +{emp.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("matching");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all shrink-0 cursor-pointer"
                >
                  Find Project
                </button>
              </div>
            ))}
            {benchEmployees.length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">Zero employees on bench! High utilization.</p>
            )}
          </div>
        </div>

        {/* Urgent Projects Demanding Resources */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Projects Seeking Talent</h2>
              <p className="text-xs text-slate-500">Open client initiatives with unfilled team slots</p>
            </div>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({openProjects.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {openProjects.slice(0, 4).map((proj) => {
              const unfilled = Math.max(0, proj.teamSize - (proj.allocatedCount || 0));
              return (
                <div key={proj.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{proj.name}</p>
                      {proj.priority === "CRITICAL" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{proj.client} • Min {proj.minExperienceYears}y exp</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                      <span className="font-semibold text-indigo-600">{unfilled} slots open</span>
                      <span>({proj.allocatedCount || 0}/{proj.teamSize} filled)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProjectForMatch(proj.id);
                      setActiveTab("matching");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="h-3 w-3" />
                    Match Candidates
                  </button>
                </div>
              );
            })}
            {openProjects.length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">All projects fully staffed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
