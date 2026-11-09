import React, { useState } from "react";
import { Search, Plus, Mail, Clock, Briefcase } from "lucide-react";

export default function Employees({ employees, onOpenAddEmployee, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
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
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Internal talent directory, technical profiles, and bench availability.
          </p>
        </div>
        <button
          onClick={onOpenAddEmployee}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Employee
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skill, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-md border border-slate-200 text-xs focus:outline-none focus:border-slate-400 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="inline-flex rounded-md border border-slate-200 bg-white p-0.5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === "ALL" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setStatusFilter("BENCH")}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === "BENCH" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              On Bench ({employees.filter((e) => e.availabilityStatus === "BENCH").length})
            </button>
            <button
              onClick={() => setStatusFilter("ALLOCATED")}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === "ALLOCATED" ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:text-slate-900"
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

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const isBench = emp.availabilityStatus === "BENCH";

          return (
            <div
              key={emp.id}
              className="rounded-lg bg-white border border-slate-200 p-4 hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{emp.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{emp.role}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isBench
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isBench ? "On Bench" : "Allocated"}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span>{emp.experienceYears} yrs experience</span>
                  <span>•</span>
                  <span>{emp.department}</span>
                </div>

                {/* Skills */}
                <div className="mt-3.5">
                  <p className="text-[11px] text-slate-400 font-medium">Skills</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {emp.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="px-2 py-0.5 rounded text-xs bg-slate-50 text-slate-700 border border-slate-200/70"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Interests */}
                {emp.careerInterests && emp.careerInterests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[11px] text-slate-400 font-medium">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {emp.careerInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-1.5 py-0.5 rounded text-[11px] text-slate-600 bg-slate-100"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 truncate max-w-[170px]">{emp.email}</span>
                {isBench ? (
                  <button
                    onClick={() => setActiveTab("matching")}
                    className="text-xs font-medium text-slate-900 hover:underline cursor-pointer"
                  >
                    Find Project →
                  </button>
                ) : (
                  <span className="text-slate-500 font-medium">Assigned</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
