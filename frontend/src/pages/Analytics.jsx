import React, { useState } from "react";
import { 
  TrendingUp, Clock, AlertTriangle, DollarSign, Users, Briefcase, 
  ShieldCheck, BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight, Layers, CheckCircle2 
} from "lucide-react";
import { useOrg } from "../context/OrgContext";
import { getBenchRiskTier } from "../services/mockData";

export default function Analytics({ employees, projects, allocations, setActiveTab, setSelectedProjectForMatch }) {
  const { orgName, formatMoney } = useOrg();

  const benchEmployees = (employees || []).filter((e) => e.availabilityStatus === "BENCH");
  const allocatedEmployees = (employees || []).filter((e) => e.availabilityStatus === "ALLOCATED");
  const openProjects = (projects || []).filter((p) => p.status === "OPEN");

  const getDaysOnBench = (benchDate) => {
    if (!benchDate) return 0;
    const diff = Math.floor((new Date() - new Date(benchDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const totalBenchDays = benchEmployees.reduce((acc, emp) => acc + getDaysOnBench(emp.benchSince), 0);
  const avgBenchDays = benchEmployees.length > 0 ? Math.round(totalBenchDays / benchEmployees.length) : 0;

  // Financial impact calculations
  const baseIdleCostPerDayUSD = 160; 
  const monthlyBenchRunRateUSD = benchEmployees.length * baseIdleCostPerDayUSD * 22;
  const potentialMonthlyRevenueRecoveryUSD = benchEmployees.length * 15000;
  const currentMonthlyBillingUSD = allocatedEmployees.length * 14000;

  // 4-Tier Bench Aging Risk Calculations
  const agingNormal = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) <= 15);
  const agingAttention = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 15 && getDaysOnBench(e.benchSince) <= 30);
  const agingHigh = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 30 && getDaysOnBench(e.benchSince) <= 45);
  const agingCritical = benchEmployees.filter((e) => getDaysOnBench(e.benchSince) > 45);

  const utilizationRate = employees.length > 0 ? Math.round((allocatedEmployees.length / employees.length) * 100) : 0;
  const benchRate = 100 - utilizationRate;
  const approvedAllocations = (allocations || []).filter(a => a.status === "APPROVED");
  const allocationSuccessRate = (allocations || []).length > 0 
    ? Math.round((approvedAllocations.length / allocations.length) * 100) 
    : 100;

  // Aggregate Top Skills Demand vs Supply
  const skillSupplyMap = {};
  employees.forEach((e) => {
    (e.skills || []).forEach((s) => {
      skillSupplyMap[s.name] = (skillSupplyMap[s.name] || 0) + 1;
    });
  });

  const skillDemandMap = {};
  projects.forEach((p) => {
    (p.requiredSkills || []).forEach((s) => {
      skillDemandMap[s.name] = (skillDemandMap[s.name] || 0) + p.teamSize;
    });
  });

  const keySkills = ["Python", "React", "TypeScript", "Node.js", "Docker", "PyTorch", "Kubernetes", "PostgreSQL"];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-200">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workforce Analytics & Bench Risks</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Module 6
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Executive utilization telemetry, margin burn analysis, and 4-tier bench duration forecasting for {orgName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("matching")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Fast-Track AI Allocation →
          </button>
        </div>
      </div>

      {/* Top 4 Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">Workforce Utilization</span>
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{utilizationRate}%</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {allocatedEmployees.length} of {employees.length} Staffed
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Target Enterprise Baseline: 85%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">Monthly Idle Cost Burn</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
              -{formatMoney(monthlyBenchRunRateUSD)}
            </span>
            <span className="text-xs font-bold text-slate-400">/mo</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Based on {benchEmployees.length} bench engineers</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">Recoverable Revenue</span>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-700 font-mono">
              +{formatMoney(potentialMonthlyRevenueRecoveryUSD)}
            </span>
            <span className="text-xs font-bold text-slate-400">/mo</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Upon 100% bench talent placement</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">Avg Bench Aging</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{avgBenchDays}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
              Days Idle
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">Across all technical practices</p>
        </div>
      </div>

      {/* 4-Tier Bench Risk Aging Deep Dive */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">4-Tier Bench Aging Risk Distribution</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Categorization based on margin erosion threshold rules</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Bench Cohort: {benchEmployees.length} Engineers
          </span>
        </div>

        {/* Visual Progress Meter */}
        <div className="w-full h-4 rounded-full bg-slate-100 flex overflow-hidden shadow-inner">
          <div 
            style={{ width: `${benchEmployees.length ? (agingNormal.length / benchEmployees.length) * 100 : 0}%` }}
            className="bg-emerald-500 hover:bg-emerald-400 transition-all cursor-pointer" 
            title={`Normal (0-15d): ${agingNormal.length} engineers`}
          />
          <div 
            style={{ width: `${benchEmployees.length ? (agingAttention.length / benchEmployees.length) * 100 : 0}%` }}
            className="bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer" 
            title={`Attention Needed (16-30d): ${agingAttention.length} engineers`}
          />
          <div 
            style={{ width: `${benchEmployees.length ? (agingHigh.length / benchEmployees.length) * 100 : 0}%` }}
            className="bg-orange-500 hover:bg-orange-400 transition-all cursor-pointer" 
            title={`High Risk (31-45d): ${agingHigh.length} engineers`}
          />
          <div 
            style={{ width: `${benchEmployees.length ? (agingCritical.length / benchEmployees.length) * 100 : 0}%` }}
            className="bg-rose-500 hover:bg-rose-400 transition-all cursor-pointer" 
            title={`Critical Overhead (>45d): ${agingCritical.length} engineers`}
          />
        </div>

        {/* 4 Detailed Cards with Actionable Talent Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-950 text-xs">0–15 Days</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {agingNormal.length} Eng ({benchEmployees.length ? Math.round((agingNormal.length / benchEmployees.length) * 100) : 0}%)
              </span>
            </div>
            <strong className="text-emerald-900 text-sm block">Normal Buffer</strong>
            <p className="text-emerald-700 text-xs">Recently rolled off client projects. In active pre-screening.</p>
            <div className="pt-1 text-[11px] font-semibold text-emerald-800">
              {agingNormal.map(e => e.name).join(", ") || "None"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 text-xs">16–30 Days</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                {agingAttention.length} Eng ({benchEmployees.length ? Math.round((agingAttention.length / benchEmployees.length) * 100) : 0}%)
              </span>
            </div>
            <strong className="text-amber-900 text-sm block">Attention Needed</strong>
            <p className="text-amber-800 text-xs">Requires immediate SOW pipeline alignment to avoid margin degradation.</p>
            <div className="pt-1 text-[11px] font-semibold text-amber-900">
              {agingAttention.map(e => e.name).join(", ") || "None"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-orange-950 text-xs">31–45 Days</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-900">
                {agingHigh.length} Eng ({benchEmployees.length ? Math.round((agingHigh.length / benchEmployees.length) * 100) : 0}%)
              </span>
            </div>
            <strong className="text-orange-900 text-sm block">High Risk</strong>
            <p className="text-orange-800 text-xs">Cost burn exceeds acceptable practice threshold. Fast-track matching required.</p>
            <div className="pt-1 text-[11px] font-semibold text-orange-950">
              {agingHigh.map(e => e.name).join(", ") || "None"}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-rose-950 text-xs">45+ Days</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                {agingCritical.length} Eng ({benchEmployees.length ? Math.round((agingCritical.length / benchEmployees.length) * 100) : 0}%)
              </span>
            </div>
            <strong className="text-rose-900 text-sm block">Critical Overhead</strong>
            <p className="text-rose-800 text-xs">Severe margin erosion. Executive staffing escalation recommended.</p>
            <div className="pt-1 text-[11px] font-semibold text-rose-950">
              {agingCritical.map(e => e.name).join(", ") || "None"}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Demand vs Supply Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Skills Demand vs. Bench Talent Supply Matrix</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Identifies technical competencies requiring aggressive talent redeployment or internal upskilling
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {keySkills.map((skill) => {
            const supply = skillSupplyMap[skill] || 0;
            const demand = skillDemandMap[skill] || 0;
            const isDeficit = demand > supply;
            return (
              <div key={skill} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">{skill}</span>
                  {isDeficit ? (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Deficit (-{demand - supply})
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Surplus (+{supply - demand})
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>Talent Supply: <strong className="text-slate-900 font-mono">{supply}</strong></span>
                  <span>SOW Demand: <strong className="text-slate-900 font-mono">{demand}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation Success & Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <strong className="text-slate-900 font-extrabold text-sm block">
              Allocation Governance Success Rate: {allocationSuccessRate}%
            </strong>
            <p className="text-slate-500 font-medium">
              Based on {approvedAllocations.length} approved out of {(allocations || []).length} total submitted SOW allocations.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 max-w-md italic border-l-2 border-slate-300 pl-3">
          <strong>* Disclaimer:</strong> Financial figures (estimated monthly idle cost burn and recoverable revenue) are modeled projections based on standard enterprise blended day rates ($160/day base overhead and $14,000–$16,000/mo billing), provided for workforce capacity planning.
        </div>
      </div>
    </div>
  );
}
