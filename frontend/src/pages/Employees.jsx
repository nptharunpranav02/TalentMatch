import React, { useState } from "react";
import { Users, Search, Filter, Plus, Briefcase, Sparkles, Award, Compass, Calendar, CheckCircle } from "lucide-react";

export default function Employees({ employees, onOpenAddEmployee, setActiveTab }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, BENCH, ALLOCATED
  const [selectedDept, setSelectedDept] = useState("ALL");

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filteredEmployees = employees.filter((emp) => {
    // Search match
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.skills || []).some((s) => s.name.toLowerCase().includes(q)) ||
      (emp.careerInterests || []).some((i) => i.toLowerCase().includes(q));

    // Status match
    const matchesStatus =
      statusFilter === "ALL" || emp.availabilityStatus === statusFilter;

    // Dept match
    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Directory</h1>
          <p className="text-sm text-slate-500">
            Track bench availability, technical skill profiles, and career interests.
          </p>
        </div>
        <button
          onClick={onOpenAddEmployee}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Register New Employee
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, skill (e.g. React), role, interest..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Status Tabs */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setStatusFilter("BENCH")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "BENCH" ? "bg-amber-500 text-white shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              On Bench ({employees.filter((e) => e.availabilityStatus === "BENCH").length})
            </button>
            <button
              onClick={() => setStatusFilter("ALLOCATED")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                statusFilter === "ALLOCATED" ? "bg-emerald-600 text-white shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Allocated ({employees.filter((e) => e.availabilityStatus === "ALLOCATED").length})
            </button>
          </div>

          {/* Department Select */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                Dept: {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          const isBench = emp.availabilityStatus === "BENCH";
          const initials = emp.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div
              key={emp.id}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Avatar & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isBench
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isBench ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
                    ></span>
                    {isBench ? "On Bench" : "Allocated"}
                  </span>
                </div>

                {/* Experience & Department */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-indigo-500" />
                    <span>{emp.experienceYears} Years Exp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{emp.department || "Engineering"}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Core Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {emp.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                      >
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          L{skill.proficiency || 3}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Interests */}
                {emp.careerInterests && emp.careerInterests.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <Compass className="h-3 w-3 text-slate-400" />
                      <span>Career Aspirations</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {emp.careerInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{emp.email}</span>
                {isBench ? (
                  <button
                    onClick={() => setActiveTab("matching")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    Match Project
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Project Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No employees match this filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or status filter.</p>
        </div>
      )}
    </div>
  );
}
