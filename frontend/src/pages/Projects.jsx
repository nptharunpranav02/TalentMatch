import React, { useState } from "react";
import { Briefcase, Plus, Sparkles, Users, Calendar, Award, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Projects({ projects, onOpenAddProject, setActiveTab, setSelectedProjectForMatch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, OPEN, FULFILLED

  const filteredProjects = projects.filter((proj) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      proj.name.toLowerCase().includes(q) ||
      proj.client.toLowerCase().includes(q) ||
      proj.description.toLowerCase().includes(q) ||
      (proj.requiredSkills || []).some((s) => s.name.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500">
            Define project tech requirements, staffing targets, and view allocation progress.
          </p>
        </div>
        <button
          onClick={onOpenAddProject}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects, client, tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              statusFilter === "ALL" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter("OPEN")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              statusFilter === "OPEN" ? "bg-indigo-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Open / Sourcing ({projects.filter((p) => p.status === "OPEN").length})
          </button>
          <button
            onClick={() => setStatusFilter("FULFILLED")}
            className={`px-3 py-1.5 rounded-md transition-all ${
              statusFilter === "FULFILLED" ? "bg-emerald-600 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Fully Staffed ({projects.filter((p) => p.status === "FULFILLED").length})
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const allocated = proj.allocatedCount || 0;
          const percent = Math.min(Math.round((allocated / proj.teamSize) * 100), 100);
          const isFulfilled = proj.status === "FULFILLED" || allocated >= proj.teamSize;

          const priorityBadge = {
            CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
            HIGH: "bg-amber-50 text-amber-700 border-amber-200",
            MEDIUM: "bg-blue-50 text-blue-700 border-blue-200",
            LOW: "bg-slate-100 text-slate-700 border-slate-200"
          }[proj.priority || "MEDIUM"];

          return (
            <div
              key={proj.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      {proj.client}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">{proj.name}</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${priorityBadge}`}
                    >
                      {proj.priority || "Standard"}
                    </span>
                    {isFulfilled ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Staffed
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                {/* Team Capacity Progress Bar */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Team Allocation</span>
                    <span className="font-bold text-slate-900">
                      {allocated} / {proj.teamSize} Assigned ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFulfilled ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-violet-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements details */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Award className="h-4 w-4 text-indigo-500" />
                    <span>Min Experience: <strong>{proj.minExperienceYears} Years</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>Target Date: <strong>{proj.deadline || "TBD"}</strong></span>
                  </div>
                </div>

                {/* Required Skills Chips */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Required Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.requiredSkills.map((req) => (
                      <span
                        key={req.name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        <span className="font-semibold">{req.name}</span>
                        <span className="text-[10px] text-slate-500">
                          (Min L{req.minProficiency || 3})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {isFulfilled ? "No additional resources needed" : `${proj.teamSize - allocated} open seats left`}
                </span>

                <button
                  onClick={() => {
                    setSelectedProjectForMatch(proj.id);
                    setActiveTab("matching");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Run AI Match
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
