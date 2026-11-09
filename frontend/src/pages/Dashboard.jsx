import React from "react";
import { Users, Briefcase, CheckSquare, Plus, ArrowRight, IndianRupee, Clock, Sparkles, TrendingUp, ShieldCheck, MapPin, Award } from "lucide-react";
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
  
  // Real enterprise metrics in INR
  const estimatedIdleCostPerDay = 3500; // ₹3,500/day dev idle cost
  const monthlyBenchRunRate = benchEmployees.length * estimatedIdleCostPerDay * 22; // ₹3.85L / month
  
  // Revenue recovery: Average billable billing rate ₹4,50,000 / month per dev
  const potentialMonthlyRevenueRecovery = benchEmployees.length * 450000;

  const agingFresh = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) <= 14).length;
  const agingModerate = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 14 && getDaysOnBench(e.benchSince) <= 30).length;
  const agingCritical = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 30).length;

  return (
    <div className="space-y-6">
      {/* Executive Header with Pitch Scenario Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise Resource Operations</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              Tier-1 Delivery Center
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time bench workforce telemetry, cost burn mitigation, and skill allocation throughput.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative inline-block">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedProjectForMatch(e.target.value);
                  setActiveTab("matching");
                }
              }}
              defaultValue=""
              className="px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-900 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="" disabled>⚡ Quick Pitch Scenario...</option>
              <option value="proj-2">Healthcare AI Diagnostic Pod (High Match)</option>
              <option value="proj-1">Fintech UPI Banking Engine (Critical)</option>
              <option value="proj-3">AWS Kubernetes Cloud Migration (DevOps)</option>
            </select>
          </div>

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

      {/* MAANG-Grade Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On Bench Headcount */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-amber-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-amber-800 font-semibold">Active Bench Headcount</span>
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
          <p className="mt-1 text-xs text-slate-500">Unallocated engineers available</p>
        </div>

        {/* Allocated Billable Talent */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-emerald-600 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-emerald-800 font-semibold">Billable Utilization</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {stats.totalEmployees > 0 ? Math.round((stats.allocatedCount / stats.totalEmployees) * 100) : 0}%
            </span>
            <span className="text-xs text-emerald-800 font-medium bg-emerald-100/70 px-1.5 py-0.5 rounded border border-emerald-200">
              {stats.allocatedCount} of {stats.totalEmployees} Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Target company utilization: 85%</p>
        </div>

        {/* Monthly Bench Idle Cost Burn */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-rose-500 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-rose-800 font-semibold">Monthly Bench Cost Burn</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-700">₹{monthlyBenchRunRate.toLocaleString('en-IN')}</span>
            <span className="text-xs text-rose-800 font-medium bg-rose-100/70 px-1.5 py-0.5 rounded border border-rose-200">
              overhead
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">₹{estimatedIdleCostPerDay.toLocaleString('en-IN')}/day per unassigned engineer</p>
        </div>

        {/* Billable Revenue Recovery Potential */}
        <div 
          onClick={() => setActiveTab("matching")}
          className="p-4 rounded-xl bg-white border border-slate-200/90 border-t-3 border-t-blue-600 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-blue-800 font-semibold">Revenue Recovery Potential</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-900">₹{(potentialMonthlyRevenueRecovery / 100000).toFixed(1)} Lakhs</span>
            <span className="text-xs text-blue-800 font-medium bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200">
              / month
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Unlocks upon 100% bench placement</p>
        </div>
      </div>

      {/* Bench Aging Telemetry Bar */}
      <div className="p-4.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-slate-100 text-slate-700">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-slate-900">Workforce Bench Aging Telemetry</span>
            <span className="text-slate-400 hidden sm:inline">(TCS / Infosys Delivery Model Standard)</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Total Unallocated: {benchEmployees.length} Engineers</span>
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

        <div className="flex items-center justify-between text-xs text-slate-600 pt-0.5 flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>&lt;14 Days (Standard Buffer): <strong className="text-slate-900">{agingFresh}</strong></span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span>15–30 Days (Active Resourcing): <strong className="text-slate-900">{agingModerate}</strong></span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>&gt;30 Days (Critical Cost Overhead): <strong className="text-rose-700">{agingCritical}</strong></span>
          </span>
        </div>
      </div>

      {/* Two-Column Working Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench List with Band & Verified Certifications */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Priority Bench Roster</h2>
              <p className="text-xs text-slate-500">Ranked by bench duration to mitigate margin degradation</p>
            </div>
            <button
              onClick={() => setActiveTab("employees")}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {benchEmployees.slice(0, 4).map((emp) => (
              <div key={emp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {emp.empCode || "TM-04821"}
                    </span>
                    <p 
                      onClick={() => onSelectEmployee(emp)}
                      className="text-sm font-semibold text-slate-900 hover:text-blue-700 cursor-pointer truncate"
                    >
                      {emp.name}
                    </p>
                    <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px]">
                      {emp.band || "L4 / SDE-2"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{(emp.location || "Bengaluru, India").split(",")[0]}</span>
                    </span>
                    <span>•</span>
                    <span>{emp.experienceYears}y exp</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {emp.skills.slice(0, 3).map((s) => (
                      <span key={s.name} className={`px-2 py-0.5 text-[11px] rounded font-medium border ${getSkillBadgeClass(s.name)}`}>
                        {s.name}
                      </span>
                    ))}
                    {emp.certifications && emp.certifications.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-0.5">
                        <ShieldCheck className="h-2.5 w-2.5" />
                        <span>Certified</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs hidden sm:block">
                    <span className="text-slate-400 block text-[10px]">Bench Time</span>
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

        {/* Active Client Engagements */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Active Client Engagements</h2>
              <p className="text-xs text-slate-500">Initiatives with active SOW & unfilled staffing quotas</p>
            </div>
            <button
              onClick={() => setActiveTab("projects")}
              className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
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
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {proj.projectCode || "PRJ-GEN"}
                      </span>
                      <p className="text-sm font-semibold text-slate-900 truncate">{proj.name}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="text-blue-800 font-medium">{proj.client}</span>
                      <span>•</span>
                      <span className="text-amber-800 font-medium bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                        {unfilled} seats open
                      </span>
                      <span>•</span>
                      <span>₹{((proj.monthlyRevenuePerDev || 420000) / 100000).toFixed(1)}L/dev billing</span>
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
