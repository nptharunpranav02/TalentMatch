import React, { useState } from "react";
import { Plus, Search, Calendar, Users } from "lucide-react";

export default function Projects({ projects, onOpenAddProject, setActiveTab, setSelectedProjectForMatch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Active client initiatives, skill demands, and team staffing progress.
          </p>
        </div>
        <button
          onClick={onOpenAddProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          New Project
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects, client, stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
          />
        </div>

        <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs font-medium">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-2.5 py-1 rounded transition-colors ${
              statusFilter === "ALL" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter("OPEN")}
            className={`px-2.5 py-1 rounded transition-colors ${
              statusFilter === "OPEN" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Open ({projects.filter((p) => p.status === "OPEN").length})
          </button>
          <button
            onClick={() => setStatusFilter("FULFILLED")}
            className={`px-2.5 py-1 rounded transition-colors ${
              statusFilter === "FULFILLED" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
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
              className="rounded-lg bg-white border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">{proj.client}</span>
                    <h2 className="text-base font-semibold text-slate-900 mt-0.5">{proj.name}</h2>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {proj.priority === "High" && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        High Priority
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                        isFulfilled
                          ? "bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {isFulfilled ? "Filled" : "Hiring"}
                    </span>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                {/* Team Allocation Bar */}
                <div className="mt-4 p-3 rounded-md bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 font-medium">Team Allocation</span>
                    <span className="font-semibold text-slate-800">
                      {allocated} of {proj.teamSize} assigned ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFulfilled ? "bg-slate-700" : "bg-slate-900"
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements info */}
                <div className="mt-3.5 flex items-center gap-4 text-xs text-slate-500">
                  <span>Min Exp: <strong className="text-slate-700 font-medium">{proj.minExperienceYears} yrs</strong></span>
                  <span>•</span>
                  <span>Deadline: <strong className="text-slate-700 font-medium">{proj.deadline || "TBD"}</strong></span>
                </div>

                {/* Required Skills */}
                <div className="mt-3.5">
                  <p className="text-[11px] text-slate-400 font-medium">Required Stack</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {proj.requiredSkills.map((req) => (
                      <span
                        key={req.name}
                        className="px-2 py-0.5 rounded text-xs bg-slate-50 text-slate-700 border border-slate-200"
                      >
                        {req.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isFulfilled ? "Fully staffed" : `${proj.teamSize - allocated} open spots remaining`}
                </span>
                <button
                  onClick={() => {
                    setSelectedProjectForMatch(proj.id);
                    setActiveTab("matching");
                  }}
                  className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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
