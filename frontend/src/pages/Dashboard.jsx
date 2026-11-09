import React from "react";
import { Users, Briefcase, CheckSquare, Plus, ArrowRight, IndianRupee, Clock, Sparkles } from "lucide-react";
import { getSkillBadgeClass } from "../utils/skillColors";

export default function Dashboard({
  stats,
  employees,
  projects,
  allocations,
  setActiveTab,
  setSelectedProjectForMatch,
  onOpenAddEmployee,
  onOpenAddProject,
  onSelectEmployee
}) {
  const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
  const openProjects = projects.filter((p) => p.status === "OPEN");
  const pendingApprovals = allocations.filter((a) => a.status === "PENDING_APPROVAL");

  const getDaysOnBench = (benchDate) => {
    if (!benchDate) return 0;
    const diff = Math.floor((new Date() - new Date(benchDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const totalBenchDays = benchEmployees.reduce((acc, emp) => acc + getDaysOnBench(emp.benchSince), 0);
  const avgBenchDays = benchEmployees.length > 0 ? Math.round(totalBenchDays / benchEmployees.length) : 0;
  const estimatedIdleCostPerDay = 3500; // ₹3,500/day standard dev idle cost in INR
  const monthlyBenchRunRate = benchEmployees.length * estimatedIdleCostPerDay * 22;

  const agingFresh = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) <= 14).length;
  const agingModerate = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 14 && getDaysOnBench(e.benchSince) <= 30).length;
  const agingCritical = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 30).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Executive Resource Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time bench telemetry, idle cost analytics, and allocation throughput.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedProjectForMatch("proj-2");
              setActiveTab("matching");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Load Demo Pitch Scenario</span>
          </button>
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            Add Employee
          </button>
          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New Project
          </button>
        </div>
      </div>

      {/* KPI Metric Cards with Natural Accent Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On Bench Card - Warm Ochre */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-amber-500 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-amber-800 font-semibold">On Bench</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.benchCount}</span>
            <span className="text-xs text-amber-800 font-medium bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
              Avg {avgBenchDays}d idle
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Unassigned engineers available</p>
        </div>

        {/* Allocated Staff Card - Forest Emerald */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-emerald-600 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-emerald-800 font-semibold">Allocated Talent</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.allocatedCount}</span>
            <span className="text-xs text-emerald-800 font-medium bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
              Active billable
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Assigned to client projects</p>
        </div>

        {/* Open Projects Card - Coastal Blue */}
        <div 
          onClick={() => setActiveTab("projects")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-blue-600 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-blue-800 font-semibold">Open Projects</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{stats.activeProjects}</span>
            <span className="text-xs text-blue-800 font-medium bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
              {stats.totalProjects} total
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Currently sourcing engineers</p>
        </div>

        {/* Monthly Bench Idle Cost - Terracotta / Rose in INR */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-rose-500 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-rose-800 font-semibold">Monthly Bench Cost</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">₹{monthlyBenchRunRate.toLocaleString('en-IN')}</span>
            <span className="text-xs text-rose-800 font-medium bg-rose-100/70 px-1.5 py-0.5 rounded border border-rose-200">
              idle overhead
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Fast allocation eliminates this cost</p>
        </div>
      </div>

      {/* Bench Aging Telemetry Bar with Natural Colors */}
      <div className="p-4.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-slate-100 text-slate-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-slate-900">Bench Aging & Placement Urgency</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Total Bench: {benchEmployees.length} Developers</span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-100 flex overflow-hidden">
          <div
            style={{ width: `${benchEmployees.length ? (agingFresh / benchEmployees.length) * 100 : 0}%` }}
            className="bg-emerald-500 transition-all"
            title={`0-14 days: ${agingFresh}`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingModerate / benchEmployees.length) * 100 : 0}%` }}
            className="bg-amber-400 transition-all"
            title={`15-30 days: ${agingModerate}`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingCritical / benchEmployees.length) * 100 : 0}%` }}
            className="bg-rose-500 transition-all"
            title={`30+ days: ${agingCritical}`}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>&lt;14 Days: <strong className="text-slate-900">{agingFresh}</strong></span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>15–30 Days: <strong className="text-slate-900">{agingModerate}</strong></span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>&gt;30 Days (Critical to place): <strong className="text-slate-900">{agingCritical}</strong></span>
          </span>
        </div>
      </div>

      {/* Two-Column Working Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench List */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Priority Bench Talent</h2>
              <p className="text-xs text-slate-500">Ranked by bench duration to reduce idle costs</p>
            </div>
            <button
              onClick={() => setActiveTab("employees")}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {benchEmployees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p 
                      onClick={() => onSelectEmployee(emp)}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-700 cursor-pointer truncate"
                    >
                      {emp.name}
                    </p>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{emp.experienceYears}y exp</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {emp.skills.slice(0, 3).map((s) => (
                      <span key={s.name} className={`px-2 py-0.5 text-[11px] rounded font-medium border ${getSkillBadgeClass(s.name)}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs hidden sm:block">
                    <span className="text-slate-400 block text-[10px]">Bench time</span>
                    <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {getDaysOnBench(emp.benchSince)}d
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectEmployee(emp)}
                    className="px-2.5 py-1 text-xs rounded border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Projects */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Open Project Openings</h2>
              <p className="text-xs text-slate-500">Initiatives currently sourcing engineers</p>
            </div>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {openProjects.slice(0, 4).map((proj) => {
              const unfilled = Math.max(0, proj.teamSize - (proj.allocatedCount || 0));
              return (
                <div key={proj.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{proj.name}</p>
                      <span className="text-[11px] px-2 py-0.2 rounded bg-blue-50 text-blue-800 font-medium border border-blue-200/70">
                        {proj.client}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Min {proj.minExperienceYears}y exp</span>
                      <span>•</span>
                      <span className="text-amber-800 font-medium bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        {unfilled} open seats
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.requiredSkills.slice(0, 3).map((s) => (
                        <span key={s.name} className={`px-2 py-0.5 text-[11px] rounded font-medium border ${getSkillBadgeClass(s.name)}`}>
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
                    className="px-3 py-1.5 text-xs rounded-md bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Match Talent
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
