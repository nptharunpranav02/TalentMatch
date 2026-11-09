import React, { useState } from "react";
import { Plus, Search, Calendar, Users, MapPin, DollarSign, IndianRupee } from "lucide-react";
import { getSkillBadgeClass } from "../utils/skillColors";

export default function Projects({ projects, onOpenAddProject, setActiveTab, setSelectedProjectForMatch }) {
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Client Engagements & SOW Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Active project requirements, staffing quotas, and billing allocation status.
          </p>
        </div>
        <button
          onClick={onOpenAddProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Engagement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by code (e.g. PRJ-FIN), client, stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:border-blue-400 bg-white"
          />
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-2xs">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "ALL" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Engagements ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter("OPEN")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "OPEN" ? "bg-blue-100 text-blue-900 font-semibold border border-blue-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active Sourcing ({projects.filter((p) => p.status === "OPEN").length})
          </button>
          <button
            onClick={() => setStatusFilter("FULFILLED")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              statusFilter === "FULFILLED" ? "bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Staffed ({projects.filter((p) => p.status === "FULFILLED").length})
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.map((proj) => {
          const allocated = proj.allocatedCount || 0;
          const percent = Math.min(Math.round((allocated / proj.teamSize) * 100), 100);
          const isFulfilled = proj.status === "FULFILLED" || allocated >= proj.teamSize;

          return (
            <div
              key={proj.id}
              className="rounded-xl bg-white border border-slate-200/90 p-5 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                        {proj.projectCode || "PRJ-GEN"}
                      </span>
                      <span className="text-xs text-blue-800 font-bold">{proj.client}</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 mt-1">{proj.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{proj.domain || "Enterprise IT"} • {proj.engagementModel || "Dedicated Pod"}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {proj.priority === "High" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        High Priority
                      </span>
                    )}
                    {proj.priority === "Critical" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        Critical SOW
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        isFulfilled
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}
                    >
                      {isFulfilled ? "Filled" : "Active Hiring"}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                {/* Team Allocation Bar */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Headcount Fill Rate</span>
                    <span className="font-bold text-slate-800">
                      {allocated} of {proj.teamSize} Allocated ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFulfilled ? "bg-emerald-600" : "bg-blue-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements info */}
                <div className="mt-3.5 flex items-center justify-between text-xs text-slate-600 bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  <span>Min Exp: <strong className="text-slate-900 font-semibold">{proj.minExperienceYears}y tenure</strong></span>
                  <span>Target: <strong className="text-slate-900 font-semibold">{proj.targetBand || "L4+"}</strong></span>
                  <span>Billing: <strong className="text-blue-900 font-semibold">₹{(proj.monthlyRevenuePerDev / 100000).toFixed(1)}L/dev</strong></span>
                </div>

                {/* Required Skills */}
                <div className="mt-4">
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Required Competencies</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.requiredSkills.map((req) => (
                      <span
                        key={req.name}
                        className={`px-2 py-0.5 rounded text-xs font-semibold border ${getSkillBadgeClass(req.name)}`}
                      >
                        {req.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {isFulfilled ? "SOW requirements satisfied" : `${proj.teamSize - allocated} open seats left in pod`}
                </span>
                <button
                  onClick={() => {
                    setSelectedProjectForMatch(proj.id);
                    setActiveTab("matching");
                  }}
                  className="px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Match Bench Talent
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
