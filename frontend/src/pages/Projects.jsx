import React, { useState } from "react";
import { Plus, Search, Calendar, Users, MapPin, DollarSign, Building2, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { getSkillBadgeClass, getAvatarColor, getInitials } from "../utils/skillColors";
import { useOrg } from "../context/OrgContext";

export default function Projects({ projects, employees, onOpenAddProject, setActiveTab, setSelectedProjectForMatch }) {
  const { formatMoney } = useOrg();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredProjects = projects.filter((proj) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      proj.name.toLowerCase().includes(q) ||
      (proj.projectCode || "").toLowerCase().includes(q) ||
      proj.client.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      (proj.requiredSkills || []).some((s) => s.name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Client Engagements & SOW Portfolio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              {projects.length} Active SOWs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Active project requirements, staffing quotas, assigned engineers, and billing allocation status.
          </p>
        </div>

        <button
          onClick={onOpenAddProject}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Engagement
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code (e.g. PRJ-FIN), client, stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white shadow-2xs font-medium"
          />
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "ALL" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            All Engagements ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter("OPEN")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "OPEN" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-blue-900 hover:bg-blue-50"
            }`}
          >
            <span>Active Sourcing</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === "OPEN" ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-900 border border-blue-300"
            }`}>
              {projects.filter((p) => p.status === "OPEN").length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("FULFILLED")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === "FULFILLED" 
                ? "bg-emerald-600 text-white shadow-xs" 
                : "text-emerald-900 hover:bg-emerald-50"
            }`}
          >
            <span>Fully Staffed</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === "FULFILLED" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
            }`}>
              {projects.filter((p) => p.status === "FULFILLED").length}
            </span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredProjects.map((proj) => {
          // Reconciled allocated talent from employees list
          const assignedList = (employees || []).filter(
            (e) => e.assignedProjectId === proj.id && e.availabilityStatus === "ALLOCATED"
          );
          const allocated = assignedList.length;
          const percent = Math.min(Math.round((allocated / proj.teamSize) * 100), 100);
          const isFulfilled = allocated >= proj.teamSize;
          const unfilledSeats = Math.max(0, proj.teamSize - allocated);

          return (
            <div
              key={proj.id}
              className="rounded-2xl bg-white border border-slate-200/90 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {proj.projectCode || "PRJ-GEN"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <Building2 className="h-3 w-3 text-blue-600" />
                        <span>{proj.client}</span>
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 mt-2 tracking-tight group-hover:text-blue-600 transition-colors">
                      {proj.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {proj.domain || "Enterprise IT"} • {proj.engagementModel || "Dedicated Pod"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {proj.priority === "Critical" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                        Critical SOW
                      </span>
                    )}
                    {proj.priority === "High" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        High Priority
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${
                        isFulfilled
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                          : "bg-blue-100 text-blue-900 border-blue-300"
                      }`}
                    >
                      {isFulfilled ? "Filled" : "Active Hiring"}
                    </span>
                  </div>
                </div>

                <p className="mt-3.5 text-xs text-slate-600 leading-relaxed font-medium">
                  {proj.description}
                </p>

                {/* Team Allocation Bar */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-700 font-bold">Capacity Fulfillment</span>
                    <span className="font-extrabold text-slate-900">
                      {allocated} of {proj.teamSize} Allocated ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFulfilled 
                          ? "bg-emerald-500" 
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* 1.1: Assigned Staff Roster on the Project Card */}
                <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1.5">
                    Assigned Project Staff ({allocated} / {proj.teamSize})
                  </span>
                  {assignedList.length > 0 ? (
                    <div className="space-y-1.5">
                      {assignedList.map((emp) => {
                        const avatar = getAvatarColor(emp.name);
                        return (
                          <div key={emp.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/80">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`h-6 w-6 rounded-md flex items-center justify-center font-bold text-[10px] ${avatar.bg} ${avatar.text} shrink-0`}>
                                {getInitials(emp.name)}
                              </div>
                              <span className="font-bold text-slate-900 truncate">{emp.name}</span>
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">{emp.band}</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                              Active SOW
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No engineers assigned yet. Matching talent from bench...</span>
                  )}
                </div>

                {/* Project Telemetry Specs */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Tenure</span>
                    <strong className="text-slate-900 font-bold">{proj.minExperienceYears}y exp</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Band</span>
                    <strong className="text-indigo-700 font-bold">{proj.targetBand || "L4+"}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Billing Rate</span>
                    <strong className="text-blue-700 font-bold">{formatMoney(proj.monthlyRevenuePerDev || 14000)}/mo</strong>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mt-4">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">Required Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.requiredSkills.map((req) => (
                      <span
                        key={req.name}
                        className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getSkillBadgeClass(req.name)}`}
                      >
                        {req.name} (L{req.minProficiency})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  {isFulfilled ? (
                    <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>SOW quotas fully staffed</span>
                    </span>
                  ) : (
                    <span className="text-amber-800 font-bold">
                      {unfilledSeats} unfilled seats in pod
                    </span>
                  )}
                </span>

                {isFulfilled ? (
                  <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                    Fully Staffed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProjectForMatch(proj.id);
                      setActiveTab("matching");
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
                  >
                    <span>Match Bench Talent</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
