import React, { useState } from "react";
import { Search, Plus, Mail, Clock, Briefcase, Eye, LayoutGrid, List, MapPin, ShieldCheck } from "lucide-react";
import { getSkillBadgeClass } from "../utils/skillColors";

export default function Employees({ employees, onOpenAddEmployee, setActiveTab, onSelectEmployee }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "table" (Google/Amazon internal tool feature)

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      (emp.empCode || "").toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.skills || []).some((s) => s.name.toLowerCase().includes(q)) ||
      (emp.careerInterests || []).some((i) => i.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || emp.availabilityStatus === statusFilter;
    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workforce Talent Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Verified technical competency profiles, seniority bands, and availability status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Dense Table vs Card View Toggle */}
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === "table" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Dense Enterprise Table View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code (e.g. TM-03914), name, skill, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:border-blue-400 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-2xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "ALL" ? "bg-slate-900 text-white font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setStatusFilter("BENCH")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "BENCH" ? "bg-amber-100 text-amber-900 font-semibold border border-amber-300" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              On Bench ({employees.filter((e) => e.availabilityStatus === "BENCH").length})
            </button>
            <button
              onClick={() => setStatusFilter("ALLOCATED")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === "ALLOCATED" ? "bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Allocated ({employees.filter((e) => e.availabilityStatus === "ALLOCATED").length})
            </button>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Table View (Google / Microsoft Internal Tool Standard) */}
      {viewMode === "table" ? (
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-slate-100">
            <thead className="bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Emp Code & Name</th>
                <th className="px-4 py-3">Band / Seniority</th>
                <th className="px-4 py-3">Base Location</th>
                <th className="px-4 py-3">Technical Stack</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const isBench = emp.availabilityStatus === "BENCH";
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {emp.empCode}
                        </span>
                        <div>
                          <strong 
                            onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                            className="text-slate-900 hover:text-blue-700 cursor-pointer font-semibold block"
                          >
                            {emp.name}
                          </strong>
                          <span className="text-[11px] text-slate-400">{emp.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                        {emp.band}
                      </span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">{emp.experienceYears}y exp</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{emp.location || "Bengaluru"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.skills.map((s) => (
                          <span key={s.name} className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${getSkillBadgeClass(s.name)}`}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isBench
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {isBench ? "On Bench" : "Allocated"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                        className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Render Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const isBench = emp.availabilityStatus === "BENCH";

            return (
              <div
                key={emp.id}
                className="rounded-xl bg-white border border-slate-200/90 p-5 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {emp.empCode}
                        </span>
                        <h3 
                          onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-700 cursor-pointer"
                        >
                          {emp.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        isBench
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}
                    >
                      {isBench ? "On Bench" : "Allocated"}
                    </span>
                  </div>

                  {/* Band & Location */}
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-800">{emp.band || "L4 / SDE-2"}</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{(emp.location || "Bengaluru, India").split(",")[0]}</span>
                    </span>
                    <span>{emp.experienceYears}y tenure</span>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Technical Competencies</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {emp.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getSkillBadgeClass(skill.name)}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {emp.certifications && emp.certifications.length > 0 && (
                    <div className="mt-3.5">
                      <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Credentials</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {emp.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 inline-flex items-center gap-1"
                          >
                            <ShieldCheck className="h-3 w-3 text-blue-600" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                    className="text-slate-500 hover:text-slate-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Dossier</span>
                  </button>

                  {isBench ? (
                    <button
                      onClick={() => setActiveTab("matching")}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                    >
                      Find Project →
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-medium">Assigned</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
