import React from "react";
import { 
  Users, Briefcase, CheckSquare, Plus, ArrowRight, Clock, Sparkles, 
  TrendingUp, ShieldCheck, MapPin, Award, DollarSign, AlertTriangle, AlertCircle, Eye,
  BarChart3, Layers, CheckCircle2, ChevronRight
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
  const benchEmployees = (employees || []).filter((e) => e.availabilityStatus === "BENCH");
  const openProjects = (projects || []).filter((p) => p.status === "OPEN");
  const pendingApprovals = (allocations || []).filter((a) => a.status === "PENDING_APPROVAL");

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

  const benchPercentage = stats.totalEmployees > 0 ? Math.round((stats.benchCount / stats.totalEmployees) * 100) : 0;
  const allocatedPercentage = stats.totalEmployees > 0 ? Math.round((stats.allocatedCount / stats.totalEmployees) * 100) : 0;

  return (
    <div className="space-y-7">
      {/* Executive Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Workforce Operations & Resource Telemetry
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Reconciled Single Source of Truth</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
              {orgName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium max-w-2xl">
            Real-time talent-to-SOW optimization, bench overhead mitigation, and algorithmic skill matching throughput.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-xs hover:border-slate-300"
          >
            <Plus className="h-4 w-4 text-blue-600" />
            <span>Add Talent</span>
          </button>
          <button
            onClick={onOpenAddProject}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/20 hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            <span>New SOW Project</span>
          </button>
        </div>
      </div>

      {/* Enterprise KPI Metrics Grid (Stripe / Linear Caliber) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* On Bench Headcount */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-amber-950 font-extrabold tracking-tight text-xs uppercase">Active Bench Talent</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 group-hover:scale-105 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">{stats.benchCount}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {benchPercentage}% of Workforce
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Bench Duration</span>
            <span className="font-bold text-slate-800">{avgBenchDays} Days</span>
          </div>
        </div>

        {/* Assigned Engineers */}
        <div 
          onClick={() => setActiveTab("employees")}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-emerald-950 font-extrabold tracking-tight text-xs uppercase">Billable Allocated</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 group-hover:scale-105 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">{stats.allocatedCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {allocatedPercentage}% Utilized
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active on SOW Pods</span>
            <span className="font-bold text-slate-800">{stats.allocatedCount} of {stats.totalEmployees} Engineers</span>
          </div>
        </div>

        {/* Open Client SOWs */}
        <div 
          onClick={() => setActiveTab("projects")}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-blue-950 font-extrabold tracking-tight text-xs uppercase">Active Client SOWs</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 group-hover:scale-105 transition-transform">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">{stats.activeProjects}</span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              of {stats.totalProjects} SOWs
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Approvals</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{pendingApprovals.length} Requests</span>
          </div>
        </div>

        {/* Financial Value Metric */}
        <div 
          onClick={() => setActiveTab("matching")}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-indigo-950 font-extrabold tracking-tight text-xs uppercase">Monthly Recoverable Run-rate</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {formatMoney(potentialMonthlyRevenueRecoveryUSD)}
            </span>
            <span className="text-xs font-bold text-indigo-700">/mo</span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Monthly Bench Cost Overhead</span>
            <span className="font-bold text-rose-700 font-mono">-{formatMoney(monthlyBenchRunRateUSD)}/mo</span>
          </div>
        </div>
      </div>

      {/* Bench Aging Risk Heatmap & Governance (Requirement 3.3) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">
                Bench Duration Risk Overview & Aging Heatmap
              </span>
              <span className="text-slate-400 text-[11px] font-medium">
                Configurable 4-Tier IT Workforce Margin Risk Protocol
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Total Bench Pool: {benchEmployees.length} Engineers
          </span>
        </div>

        {/* 4-Tier Segmented Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
          <div
            style={{ width: `${benchEmployees.length ? (agingNormal / benchEmployees.length) * 100 : 0}%` }}
            className="bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer"
            title={`0–15 Days (Normal): ${agingNormal} engineers`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingAttention / benchEmployees.length) * 100 : 0}%` }}
            className="bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer"
            title={`16–30 Days (Attention Needed): ${agingAttention} engineers`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingHigh / benchEmployees.length) * 100 : 0}%` }}
            className="bg-orange-500 hover:bg-orange-400 transition-all cursor-pointer"
            title={`31–45 Days (High Risk): ${agingHigh} engineers`}
          ></div>
          <div
            style={{ width: `${benchEmployees.length ? (agingCritical / benchEmployees.length) * 100 : 0}%` }}
            className="bg-rose-500 hover:bg-rose-400 transition-all cursor-pointer"
            title={`45+ Days (Critical Overhead): ${agingCritical} engineers`}
          ></div>
        </div>

        {/* 4-Tier Detailed Legend Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-xs">0–15 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {agingNormal} Eng
              </span>
            </div>
            <strong className="text-emerald-800 text-[11px] block mt-1">Normal Buffer</strong>
            <span className="text-[10px] text-emerald-600 block">Standard Onboarding</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 text-xs">16–30 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                {agingAttention} Eng
              </span>
            </div>
            <strong className="text-amber-800 text-[11px] block mt-1">Attention Needed</strong>
            <span className="text-[10px] text-amber-600 block">Active SOW Matching</span>
          </div>

          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-orange-950 text-xs">31–45 Days</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                {agingHigh} Eng
              </span>
            </div>
            <strong className="text-orange-800 text-[11px] block mt-1">High Risk</strong>
            <span className="text-[10px] text-orange-600 block">Staffing Escalation</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 shadow-2xs">
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

      {/* High-Risk Staffing Alert */}
      {totalAtRisk > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                Executive Staffing Attention: {totalAtRisk} Engineers in High Risk / Critical Idle Bands
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Engineers idling &gt;30 days degrade margin realization. Recommend running automated AI matching to fast-track allocations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("matching")}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-500/20 whitespace-nowrap self-end sm:self-auto"
          >
            Fast-Track AI Matching →
          </button>
        </div>
      )}

      {/* Two-Column Working Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Bench List */}
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Priority Bench Roster</h2>
                <p className="text-xs text-slate-500 font-medium">Ranked by bench duration to mitigate margin degradation</p>
              </div>
              <button
                onClick={() => setActiveTab("employees")}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Directory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {benchEmployees.slice(0, 4).map((emp) => {
                const benchDays = getDaysOnBench(emp.benchSince);
                const risk = getBenchRiskTier(benchDays);
                return (
                  <div key={emp.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
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
                        {(emp.skills || []).slice(0, 3).map((s) => (
                          <span key={s.name} className={`px-2 py-0.5 text-[11px] rounded-md font-semibold border ${badgeStyles.technicalSkill}`}>
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
                        <span className="font-extrabold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
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
        <div className="rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Active Client Engagements</h2>
                <p className="text-xs text-slate-500 font-medium">Initiatives with active SOW & unfilled staffing quotas</p>
              </div>
              <button
                onClick={() => setActiveTab("projects")}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>All Projects</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {openProjects.slice(0, 4).map((proj) => {
                const unfilled = Math.max(0, proj.teamSize - (proj.allocatedCount || 0));
                const revenueUSD = proj.billingRatePerDevMonthlyUSD || proj.monthlyRevenuePerDev || 14000;
                return (
                  <div key={proj.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
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
                        <span className="text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                          {unfilled} seats open
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{formatMoney(revenueUSD)} / dev / mo</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(proj.requiredSkills || []).slice(0, 3).map((s) => (
                          <span key={s.name} className={`px-2 py-0.5 text-[11px] rounded-md font-semibold border ${badgeStyles.requiredSkill}`}>
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
                      className="px-3.5 py-2 text-xs rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shrink-0 cursor-pointer shadow-md shadow-blue-500/20"
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
