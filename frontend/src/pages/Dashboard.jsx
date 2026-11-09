import React from "react";
import { Users, Briefcase, CheckSquare, Plus, ArrowRight, Clock, AlertCircle } from "lucide-react";

export default function Dashboard({
  stats,
  employees,
  projects,
  allocations,
  setActiveTab,
  setSelectedProjectForMatch,
  onOpenAddEmployee,
  onOpenAddProject
}) {
  const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
  const openProjects = projects.filter((p) => p.status === "OPEN");
  const pendingApprovals = allocations.filter((a) => a.status === "PENDING_APPROVAL");

  const getDaysOnBench = (benchDate) => {
    if (!benchDate) return 0;
    const diff = Math.floor((new Date() - new Date(benchDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Resource allocation overview and bench management status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            Add Employee
          </button>
          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>On Bench</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{stats.benchCount}</span>
            <span className="text-xs text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
              Unassigned
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Available for project staffing</p>
        </div>

        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Allocated</span>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{stats.allocatedCount}</span>
            <span className="text-xs text-slate-500">of {stats.totalEmployees} staff</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Assigned to active client projects</p>
        </div>

        <div 
          onClick={() => setActiveTab("projects")}
          className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Open Projects</span>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{stats.activeProjects}</span>
            <span className="text-xs text-slate-500">projects</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Currently requiring talent</p>
        </div>

        <div 
          onClick={() => setActiveTab("approvals")}
          className="p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Approvals</span>
            <CheckSquare className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">{stats.pendingApprovals}</span>
            {stats.pendingApprovals > 0 && (
              <span className="text-xs text-rose-700 font-medium bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                Action Needed
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">Awaiting manager decision</p>
        </div>
      </div>

      {/* Two-Column Working Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench List */}
        <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Available on Bench</h2>
              <p className="text-xs text-slate-500">Engineers waiting for suitable project assignments</p>
            </div>
            <button
              onClick={() => setActiveTab("employees")}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {benchEmployees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">{emp.name}</p>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{emp.experienceYears}y exp</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {emp.skills.slice(0, 3).map((s) => (
                      <span key={s.name} className="px-1.5 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs hidden sm:block">
                    <span className="text-slate-400">Bench time: </span>
                    <span className="font-medium text-slate-700">{getDaysOnBench(emp.benchSince)}d</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("matching")}
                    className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    Match
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Projects */}
        <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Open Project Openings</h2>
              <p className="text-xs text-slate-500">Initiatives currently sourcing engineers</p>
            </div>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {openProjects.slice(0, 4).map((proj) => {
              const unfilled = Math.max(0, proj.teamSize - (proj.allocatedCount || 0));
              return (
                <div key={proj.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900 truncate">{proj.name}</p>
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {proj.client}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Min {proj.minExperienceYears}y exp</span>
                      <span>•</span>
                      <span className="text-amber-800 font-medium">{unfilled} open seats</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.requiredSkills.slice(0, 3).map((s) => (
                        <span key={s.name} className="px-1.5 py-0.5 text-[11px] rounded bg-slate-50 text-slate-600 border border-slate-100">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProjectForMatch(proj.id);
                      setActiveTab("matching");
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors shrink-0 cursor-pointer"
                  >
                    Find Talent
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
