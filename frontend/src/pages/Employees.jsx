import React, { useState } from "react";
import { Search, Plus, Mail, Clock, Briefcase, Eye, LayoutGrid, List, MapPin, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { getSkillBadgeClass, getAvatarColor, getInitials } from "../utils/skillColors";

export default function Employees({ employees, onOpenAddEmployee, setActiveTab, onSelectEmployee }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [viewMode, setViewMode] = useState("cards");

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      (emp.empCode || "").toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.assignedProjectName || "").toLowerCase().includes(q) ||
      (emp.skills || []).some((s) => s.name.toLowerCase().includes(q)) ||
      (emp.careerInterests || []).some((i) => i.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "ALL" || emp.availabilityStatus === statusFilter;
    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const getDaysOnBench = (benchDate) => {
    if (!benchDate) return 0;
    const diff = Math.floor((new Date() - new Date(benchDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
  const allocatedEmployees = employees.filter((e) => e.availabilityStatus === "ALLOCATED");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workforce Talent Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              {employees.length} Total Engineers
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-2xs">
              {benchEmployees.length} on Bench
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-2xs">
              {allocatedEmployees.length} Allocated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Verified technical competency profiles, seniority bands, client project assignments, and availability status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Dense Table vs Card View Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "cards" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title="Card View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "table" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title="Dense Enterprise Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code (e.g. TM-04821), name, project, role, skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white shadow-2xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Status Tabs: Guaranteed 100% Mathematical Reconcilation */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "ALL" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setStatusFilter("BENCH")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "BENCH" 
                  ? "bg-amber-500 text-white shadow-xs" 
                  : "text-amber-900 hover:bg-amber-50"
              }`}
            >
              <span>On Bench</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === "BENCH" ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}>
                {benchEmployees.length}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter("ALLOCATED")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "ALLOCATED" 
                  ? "bg-emerald-600 text-white shadow-xs" 
                  : "text-emerald-900 hover:bg-emerald-50"
              }`}
            >
              <span>Allocated</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                statusFilter === "ALLOCATED" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-900 border border-emerald-300"
              }`}>
                {allocatedEmployees.length}
              </span>
            </button>
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-semibold focus:outline-none focus:border-blue-400 shadow-2xs cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Dense Table View */}
      {viewMode === "table" ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-slate-100">
            <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Engineer & ID</th>
                <th className="px-5 py-3.5">Band & Tenure</th>
                <th className="px-5 py-3.5">Base Office</th>
                <th className="px-5 py-3.5">Technical Stack</th>
                <th className="px-5 py-3.5">Assignment & Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const isBench = emp.availabilityStatus === "BENCH";
                const avatar = getAvatarColor(emp.name);
                const initials = getInitials(emp.name);
                const benchDays = getDaysOnBench(emp.benchSince);

                return (
                  <tr key={emp.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                              {emp.empCode}
                            </span>
                            <strong 
                              onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                              className="text-slate-900 hover:text-blue-600 cursor-pointer font-bold block"
                            >
                              {emp.name}
                            </strong>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">{emp.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                        {emp.band}
                      </span>
                      <span className="text-slate-500 text-[11px] block mt-1 font-medium">{emp.experienceYears}y exp</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        <span>{(emp.location || "Global Remote").split(",")[0]}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s.name} className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getSkillBadgeClass(s.name)}`}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {isBench ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock className="h-3 w-3 text-amber-700" />
                          <span>On Bench ({benchDays}d)</span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Allocated
                          </span>
                          <span className="block text-[11px] font-bold text-slate-800 mt-1 truncate max-w-xs" title={emp.assignedProjectName}>
                            {emp.assignedProjectName || "Active SOW Project"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-slate-300"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Render Modern Card Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const isBench = emp.availabilityStatus === "BENCH";
            const avatar = getAvatarColor(emp.name);
            const initials = getInitials(emp.name);
            const benchDays = getDaysOnBench(emp.benchSince);

            return (
              <div
                key={emp.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Card Header with Bright Avatar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0 group-hover:scale-105 transition-transform`}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                            {emp.empCode}
                          </span>
                          <h3 
                            onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                            className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer truncate"
                          >
                            {emp.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate font-medium">{emp.role}</p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 ${
                        isBench
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-emerald-100 text-emerald-900 border-emerald-300"
                      }`}
                    >
                      {isBench ? "On Bench" : "Allocated"}
                    </span>
                  </div>

                  {/* Seniority Band, Base Location & Project Assignment */}
                  <div className="mt-4 flex items-center justify-between text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 text-[11px]">
                      {emp.band || "L4 / Senior SDE"}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      <span>{(emp.location || "Bengaluru").split(",")[0]}</span>
                    </span>
                    <span className="text-slate-600 font-semibold">{emp.experienceYears}y tenure</span>
                  </div>

                  {/* 1.1: If Allocated, Show Exactly Which Project They Are Staffed On */}
                  {!isBench && emp.assignedProjectName && (
                    <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-emerald-800">Assigned Project:</span>
                      <strong className="text-slate-900 text-[11px] font-extrabold truncate max-w-[180px]">
                        {emp.assignedProjectName}
                      </strong>
                    </div>
                  )}

                  {/* Technical Competencies with Categorized Bright Badges */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                      <span>Technical Stack</span>
                      {isBench && (
                        <span className="text-amber-800 font-extrabold normal-case">
                          {benchDays}d idle
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {emp.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getSkillBadgeClass(skill.name)}`}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Industry Certifications */}
                  {emp.certifications && emp.certifications.length > 0 && (
                    <div className="mt-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {emp.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 inline-flex items-center gap-1 shadow-2xs"
                          >
                            <ShieldCheck className="h-3 w-3 text-blue-600" />
                            <span>{cert}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                    className="text-slate-600 hover:text-blue-600 font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span>Dossier</span>
                  </button>

                  {isBench ? (
                    <button
                      onClick={() => setActiveTab("matching")}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer border border-blue-200"
                    >
                      Find Project →
                    </button>
                  ) : (
                    <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Committed to SOW</span>
                    </span>
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
