import React from "react";
import { 
  Users, Briefcase, CheckSquare, Plus, ArrowRight, Clock, Sparkles, 
  TrendingUp, ShieldCheck, MapPin, Award, DollarSign, AlertTriangle, AlertCircle, Eye 
} from "lucide-react";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import { getBenchRiskTier } from "../services/mockData";
import { useOrg } from "../context/OrgContext";

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
  const { orgName, formatMoney, currency } = useOrg();
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
  
  const baseIdleCostPerDayUSD = 160; 
  const monthlyBenchRunRateUSD = benchEmployees.length * baseIdleCostPerDayUSD * 22;
  const potentialMonthlyRevenueRecoveryUSD = benchEmployees.length * 15000;

  // 3.3: 4-Tier Bench Aging Risk Calculations
  const agingNormal = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) <= 15).length;
  const agingAttention = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 15 && getDaysOnBench(e.benchSince) <= 30).length;
  const agingHigh = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 30 && getDaysOnBench(e.benchSince) <= 45).length;
  const agingCritical = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 45).length;

  const totalAtRisk = agingHigh + agingCritical;

  return (
    <div className="space-y-6">
      {/* Executive Header with Pitch Scenario Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workforce Operations & Resource Telemetry</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Telemetry Synced • Just Now</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              {orgName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
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
              className="px-3.5 py-2 rounded-xl border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 text-xs font-bold focus:outline-none cursor-pointer shadow-xs hover:border-blue-400 transition-all"
            >
              <option value="" disabled>⚡ Quick Pitch Scenarios...</option>
              <option value="proj-2">Healthcare AI Diagnostic Pod (High Match)</option>
              <option value="proj-1">Fintech UPI Banking Engine (Critical SOW)</option>
              <option value="proj-3">Multi-Cloud Kubernetes Migration (DevOps)</option>
            </select>
          </div>

          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="h-4 w-4 text-blue-600" />
            Add Employee
          </button>
          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Radiant, High-Impact KPI Cards with Harmonic Color Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On Bench Headcount - Bright Warm Amber */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-amber-50/60 border border-amber-200/90 border-t-4 border-t-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-amber-900 font-bold tracking-tight">Active Bench Roster</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:scale-110 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.benchCount}</span>
            <span className="text-xs font-bold text-amber-800">
              {stats.totalEmployees > 0 ? Math.round((stats.benchCount / stats.totalEmployees) * 100) : 0}% of Total
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Avg Bench Duration: {avgBenchDays} Days</p>
        </div>

        {/* Assigned Engineers - Vivid Emerald Green */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-emerald-50/60 border border-emerald-200/90 border-t-4 border-t-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-emerald-900 font-bold tracking-tight">Billable Allocated</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.allocatedCount}</span>
            <span className="text-xs font-bold text-emerald-800">
              {stats.totalEmployees > 0 ? Math.round((stats.allocatedCount / stats.totalEmployees) * 100) : 0}% Utilized
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Active on Client Deliverables</p>
        </div>

        {/* Active Client SOWs - Royal Indigo/Blue */}
        <div 
          onClick={() => setActiveTab("projects")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-blue-50/60 border border-blue-200/90 border-t-4 border-t-blue-600 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-blue-900 font-bold tracking-tight">Open SOW Engagements</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700 group-hover:scale-110 transition-transform">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeProjects}</span>
            <span className="text-xs font-bold text-blue-700">of {stats.totalProjects} SOWs Active</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Ready for AI Talent Sourcing</p>
        </div>

        {/* Financial Value Metric - Crisp Violet */}
        <div 
          onClick={() => setActiveTab("matching")}
          className="p-5 rounded-2xl bg-gradient-to-br from-white via-white to-indigo-50/60 border border-indigo-200/90 border-t-4 border-t-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-indigo-900 font-bold tracking-tight">Recoverable Billable Run-rate</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-110 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatMoney(potentialMonthlyRevenueRecoveryUSD)}
            </span>
            <span className="text-xs font-bold text-indigo-700">/mo</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Unlocked upon 100% bench staffing</p>
        </div>
      </div>

      {/* 3.3: Enterprise Bench Duration Risk Overview (4 Configurable Tiers) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">
                Bench Duration Risk Overview & Aging Telemetry
              </span>
              <span className="text-slate-400 text-[11px] font-medium">
                4-Tier IT Workforce Margin Risk Protocol (Standard vs Critical Idle Bands)
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Total Bench Pool: {benchEmployees.length} Engineers
          </span>
        </div>

        {/* 4-Tier Segmented Progress Bar */}
        <div className="w-full h-3.5 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
          <div
            style={{ width: `${benchEmployees.length ? (agingNormal / benchEmployees.length) * 100 : 0}%` }}
            className="bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer"
            title={`0–15 Days (Normal): ${agingNormal}`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingAttention / benchEmployees.length) * 100 : 0}%` }}
            className="bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer"
            title={`16–30 Days (Attention Needed): ${agingAttention}`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingHigh / benchEmployees.length) * 100 : 0}%` }}
            className="bg-orange-500 hover:bg-orange-400 transition-all cursor-pointer"
            title={`31–45 Days (High Risk): ${agingHigh}`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingCritical / benchEmployees.length) * 100 : 0}%` }}
            className="bg-rose-500 hover:bg-rose-400 transition-all cursor-pointer"
            title={`45+ Days (Critical Overhead): ${agingCritical}`}
          ></div>
        </div>

        {/* 4-Tier Detailed Legend Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-xs">0–15 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {agingNormal} Eng
              </span>
            </div>
            <strong className="text-emerald-800 text-[11px] block mt-1">Normal Buffer</strong>
            <span className="text-[10px] text-emerald-600 block">Standard Onboarding</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 text-xs">16–30 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                {agingAttention} Eng
              </span>
            </div>
            <strong className="text-amber-800 text-[11px] block mt-1">Attention Needed</strong>
            <span className="text-[10px] text-amber-600 block">Active SOW Matching</span>
          </div>

          <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-orange-950 text-xs">31–45 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                {agingHigh} Eng
              </span>
            </div>
            <strong className="text-orange-800 text-[11px] block mt-1">High Risk</strong>
            <span className="text-[10px] text-orange-600 block">Staffing Escalation</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-950 text-xs">45+ Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                {agingCritical} Eng
              </span>
            </div>
            <strong className="text-rose-800 text-[11px] block mt-1">Critical Overhead</strong>
            <span className="text-[10px] text-rose-600 block">Executive Priority</span>
          </div>
        </div>
      </div>

      {/* 3.3: Manager Action Alert for High Risk & Critical Overhead */}
      {totalAtRisk > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-2xs shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Executive Staffing Attention Required: {totalAtRisk} Engineers in High Risk / Critical Idle Tiers
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Engineers idling &gt;30 days degrade margin realization. Recommend running automated AI matching to fast-track allocations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("matching")}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap self-end sm:self-auto"
          >
            Fast-Track AI Matching →
          </button>
        </div>
      )}

      {/* Two-Column Working Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bench List with Band & Verified Certifications */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Priority Bench Roster</h2>
                <p className="text-xs text-slate-500">Ranked by bench duration to mitigate margin degradation</p>
              </div>
              <button
                onClick={() => setActiveTab("employees")}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {benchEmployees.slice(0, 4).map((emp) => {
                const benchDays = getDaysOnBench(emp.benchSince);
                const risk = getBenchRiskTier(benchDays);
                return (
                  <div key={emp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {emp.empCode || "TM-04821"}
                        </span>
                        <p 
                          onClick={() => onSelectEmployee(emp)}
                          className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                        >
                          {emp.name}
                        </p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] border border-slate-200">
                          {emp.band || "L4 / Senior SDE"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${risk.badgeClass}`}>
                          {risk.tier}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{(emp.location || "Global Remote").split(",")[0]}</span>
                        </span>
                        <span>•</span>
                        <span>{emp.experienceYears}y exp</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s.name} className={`px-2.5 py-0.5 text-[11px] rounded-md font-semibold border ${badgeStyles.technicalSkill}`}>
                            {s.name}
                          </span>
                        ))}
                        {emp.certifications && emp.certifications.length > 0 && (
                          <span className={`px-2 py-0.5 text-[10px] rounded-md font-bold border inline-flex items-center gap-1 ${badgeStyles.certification}`}>
                            <ShieldCheck className="h-3 w-3 text-purple-600" />
                            <span>Certified</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right text-xs hidden sm:block">
                        <span className="text-slate-400 block text-[10px] font-semibold uppercase">Bench Time</span>
                        <span className="font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {benchDays}d
                        </span>
                      </div>
                      <button
                        onClick={() => onSelectEmployee(emp)}
                        className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold transition-all cursor-pointer shadow-2xs hover:border-slate-300 inline-flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-500" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Client Engagements */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Client Engagements</h2>
                <p className="text-xs text-slate-500">Initiatives with active SOW & unfilled staffing quotas</p>
              </div>
              <button
                onClick={() => setActiveTab("projects")}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {openProjects.slice(0, 4).map((proj) => {
                const unfilled = Math.max(0, proj.teamSize - (proj.allocatedCount || 0));
                const revenueUSD = proj.monthlyRevenuePerDev || 14000;
                return (
                  <div key={proj.id} className="p-4 flex items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                          {proj.projectCode || "PRJ-GEN"}
                        </span>
                        <p className="text-sm font-bold text-slate-900 truncate">{proj.name}</p>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5 font-medium">
                        <span className="text-blue-700 font-bold">{proj.client}</span>
                        <span>•</span>
                        <span className="text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          {unfilled} seats open
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{formatMoney(revenueUSD)} / dev / mo</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {proj.requiredSkills.slice(0, 3).map((s) => (
                          <span key={s.name} className={`px-2.5 py-0.5 text-[11px] rounded-md font-semibold border ${badgeStyles.requiredSkill}`}>
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
                      className="px-3.5 py-2 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shrink-0 cursor-pointer shadow-sm shadow-blue-200"
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
    </div>
  );
}
