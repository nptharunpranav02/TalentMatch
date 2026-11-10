import React from "react";
import { 
  X, Building2, Calendar, Users, DollarSign, MapPin, 
  CheckCircle2, Clock, ArrowRight, ShieldCheck, UserCheck, 
  Layers, AlertCircle, FileText, Target, Milestone
} from "lucide-react";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import { useOrg } from "../context/OrgContext";

export default function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  employees = [],
  onMatchBenchTalent,
  onSelectEmployee
}) {
  const { formatMoney } = useOrg();

  if (!isOpen || !project) return null;

  // Find all employees allocated to this project
  const allocatedEmployees = employees.filter(
    (e) => e.assignedProjectId === project.id && e.availabilityStatus === "ALLOCATED"
  );

  const teamSize = project.teamSize || 4;
  const allocatedCount = allocatedEmployees.length;
  const unfilledSeats = Math.max(0, teamSize - allocatedCount);
  const percentFilled = Math.round((allocatedCount / teamSize) * 100);
  const isFulfilled = allocatedCount >= teamSize;

  const totalMonthlyRunRateUSD = allocatedCount * (project.monthlyRevenuePerDev || 14000);
  const totalMaxRunRateUSD = teamSize * (project.monthlyRevenuePerDev || 14000);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-6 sm:px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close SOW Workspace"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 font-bold border border-blue-400/30">
                {project.projectCode || "PRJ-FIN-8021"}
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">{project.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                project.priority === "Critical" 
                  ? "bg-rose-500/20 text-rose-200 border-rose-400/40" 
                  : "bg-amber-500/20 text-amber-200 border-amber-400/40"
              }`}>
                {project.priority || "High Priority"}
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Building2 className="h-4 w-4 text-blue-400" />
                <span>{project.client}</span>
              </span>
              <span>•</span>
              <span className="text-blue-200">{project.domain || "Enterprise Engineering"}</span>
              <span>•</span>
              <span className="text-slate-300">Model: {project.engagementModel || "Dedicated Pod (T&M)"}</span>
            </p>

            {project.clientContact && (
              <p className="text-xs text-slate-400 font-medium">
                SOW Executive Sponsor: <strong className="text-slate-200">{project.clientContact}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Capacity & Quota Fulfillment Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border border-blue-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-extrabold text-sm text-slate-900">
                  Engineering Pod Capacity & Staffing Quota
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                isFulfilled 
                  ? "bg-emerald-100 text-emerald-900 border-emerald-300" 
                  : "bg-amber-100 text-amber-900 border-amber-300"
              }`}>
                {isFulfilled ? "100% Fully Staffed" : `${unfilledSeats} Open Positions`}
              </span>
            </div>

            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFulfilled ? "bg-emerald-500" : "bg-blue-600"
                }`}
                style={{ width: `${Math.min(percentFilled, 100)}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Allocated Engineers</span>
                <strong className="text-lg font-black text-slate-900">{allocatedCount} / {teamSize} Seats</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Open Headcount</span>
                <strong className={`text-lg font-black ${unfilledSeats > 0 ? "text-amber-800" : "text-emerald-700"}`}>
                  {unfilledSeats} Vacancies
                </strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Current Run-rate</span>
                <strong className="text-lg font-black text-blue-700">{formatMoney(totalMonthlyRunRateUSD)} / mo</strong>
                <span className="text-[10px] text-slate-400 font-medium block">({allocatedCount} active engineer{allocatedCount === 1 ? "" : "s"})</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Target Quota Potential</span>
                <strong className="text-lg font-black text-slate-800">{formatMoney(totalMaxRunRateUSD)} / mo</strong>
                <span className="text-[10px] text-slate-400 font-medium block">(at {teamSize} devs quota)</span>
              </div>
            </div>
          </div>

          {/* Full Scope of Work / SOW Statement */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Statement of Work & Technical Deliverables
            </span>
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {project.description}
            </div>
          </div>

          {/* Required Competencies & Target Proficiency (Section 3.4) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Required Technical Competencies & Target Levels
              </span>
              <span className="text-xs font-bold text-slate-500">
                Rate: {formatMoney(project.monthlyRevenuePerDev || 14000)} / dev / month • Min Threshold: {project.minExperienceYears}y exp • Target Band: {project.targetBand || "L4+"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(project.requiredSkills || []).map((req) => (
                <div 
                  key={req.name}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${badgeStyles.requiredSkill}`}>
                      {req.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-xs text-blue-700 block">
                      {req.targetLabel || "Proficient"} (L{req.minProficiency})
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Weight: {req.weight || 1.0}x</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocated Team Members Roster */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Assigned Engineering Roster ({allocatedCount} Members)
              </span>
              {unfilledSeats > 0 && (
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {unfilledSeats} more engineer{unfilledSeats > 1 ? "s" : ""} required
                </span>
              )}
            </div>

            {allocatedEmployees.length === 0 ? (
              <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl text-xs space-y-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
                <p className="font-bold text-slate-700">No engineers currently allocated to this project.</p>
                <p className="text-slate-400">Click "Match Bench Talent" below to select ranked candidates from the bench.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allocatedEmployees.map((emp) => {
                  const avatar = getAvatarColor(emp.name);
                  const initials = getInitials(emp.name);
                  return (
                    <div 
                      key={emp.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-blue-300 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-extrabold text-sm ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {emp.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium block truncate">{emp.role}</span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 mt-0.5 inline-block">
                            {emp.band || "L4 / Senior SDE"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectEmployee) onSelectEmployee(emp);
                        }}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 cursor-pointer shrink-0 transition-colors"
                      >
                        Dossier
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Timeline & Milestones */}
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Engagement Milestones & Delivery Schedule
            </span>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">
                  SOW Kickoff: <strong className="text-slate-900">{project.startDate || "2026-11-01"}</strong>
                </span>
                <span className="text-slate-500 font-medium">
                  Target Production Cutover: <strong className="text-slate-900">{project.deadline || "2027-03-31"}</strong>
                </span>
              </div>

              {project.milestones && project.milestones.length > 0 ? (
                <div className="space-y-2">
                  {project.milestones.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Milestone className="h-4 w-4 text-blue-600 shrink-0" />
                        <strong className="text-slate-800">{m.name}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">{m.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          m.status === "Completed" ? "bg-emerald-100 text-emerald-900 border-emerald-300" :
                          m.status === "In Progress" ? "bg-blue-100 text-blue-900 border-blue-300" :
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500">Standard agile two-week sprint cadence active.</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close SOW
          </button>

          {!isFulfilled ? (
            <button
              onClick={() => {
                onClose();
                if (onMatchBenchTalent) onMatchBenchTalent(project.id);
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
            >
              <span>Match Bench Talent ({unfilledSeats} Seats Open)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Pod Capacity 100% Satisfied</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
