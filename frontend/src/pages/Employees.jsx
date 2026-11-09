import React, { useState, useMemo } from "react";
import { 
  Search, Plus, Mail, Clock, Briefcase, Eye, LayoutGrid, List, MapPin, 
  ShieldCheck, Sparkles, CheckCircle2, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw, Download, CheckSquare2, Square 
} from "lucide-react";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import { getBenchRiskTier } from "../services/mockData";

export default function Employees({ employees, onOpenAddEmployee, setActiveTab, onSelectEmployee, onEditEmployee, onDeleteEmployee }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  // Advanced Multi-Dimensional Filter States (Requirement 2.7)
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [selectedExpRange, setSelectedExpRange] = useState("ALL");
  const [selectedBand, setSelectedBand] = useState("ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedBenchAging, setSelectedBenchAging] = useState("ALL");
  const [certOnly, setCertOnly] = useState(false);

  // Table Sorting States (Requirement 2.8)
  const [sortField, setSortField] = useState("benchDays"); // 'name' | 'experience' | 'benchDays' | 'band' | 'status'
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedEmpIds, setSelectedEmpIds] = useState(new Set());

  // Extract unique filter dropdown values
  const allSkills = useMemo(() => {
    const s = new Set();
    employees.forEach(e => (e.skills || []).forEach(sk => s.add(sk.name)));
    return ["ALL", ...Array.from(s).sort()];
  }, [employees]);

  const allLocations = useMemo(() => {
    const l = new Set();
    employees.forEach(e => {
      if (e.location) l.add(e.location.split(",")[0].trim());
    });
    return ["ALL", ...Array.from(l).sort()];
  }, [employees]);

  const allBands = ["ALL", "L3", "L4", "L5", "L6"];

  const getDaysOnBench = (benchDate) => {
    if (!benchDate) return 0;
    const diff = Math.floor((new Date() - new Date(benchDate)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const getBandRank = (bandStr = "") => {
    if (bandStr.includes("L6")) return 6;
    if (bandStr.includes("L5")) return 5;
    if (bandStr.includes("L4")) return 4;
    if (bandStr.includes("L3")) return 3;
    return 1;
  };

    // 4.10: Bulk Employee Actions & CSV Export
  const toggleSelectEmployee = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedEmpIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedEmpIds.size === filteredEmployees.length) {
      setSelectedEmpIds(new Set());
    } else {
      setSelectedEmpIds(new Set(filteredEmployees.map((e) => e.id)));
    }
  };

  const handleExportCSV = () => {
    const list = selectedEmpIds.size > 0 
      ? employees.filter((e) => selectedEmpIds.has(e.id))
      : filteredEmployees;
    
    const headers = ["Emp Code,Name,Email,Role,Band,Experience (Yrs),Status,Bench Days,Base Office,Skills,Certifications"];
    const rows = list.map((e) => {
      const bDays = e.availabilityStatus === "BENCH" ? getDaysOnBench(e.benchSince) : 0;
      const skillsStr = `"${(e.skills || []).map((s) => s.name).join("; ")}"`;
      const certsStr = `"${(e.certifications || []).join("; ")}"`;
      return `"${e.empCode || ""}",${e.name},${e.email},"${e.role}","${e.band || ""}",${e.experienceYears},"${e.availabilityStatus}",${bDays},"${e.location || ""}",${skillsStr},${certsStr}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `talentmatch_workforce_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFilterCount = (statusFilter !== "ALL" ? 1 : 0) +
    (selectedSkill !== "ALL" ? 1 : 0) +
    (selectedExpRange !== "ALL" ? 1 : 0) +
    (selectedBand !== "ALL" ? 1 : 0) +
    (selectedLocation !== "ALL" ? 1 : 0) +
    (selectedBenchAging !== "ALL" ? 1 : 0) +
    (certOnly ? 1 : 0);

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedSkill("ALL");
    setSelectedExpRange("ALL");
    setSelectedBand("ALL");
    setSelectedLocation("ALL");
    setSelectedBenchAging("ALL");
    setCertOnly(false);
  };

  // Combined Multi-Dimensional Filtering (Requirement 2.7)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        emp.name.toLowerCase().includes(q) ||
        (emp.empCode || "").toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        (emp.assignedProjectName || "").toLowerCase().includes(q) ||
        (emp.skills || []).some((s) => s.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || emp.availabilityStatus === statusFilter;
      
      const matchesSkill = selectedSkill === "ALL" ||
        (emp.skills || []).some((s) => s.name.toLowerCase() === selectedSkill.toLowerCase());

      const exp = emp.experienceYears || 0;
      let matchesExp = true;
      if (selectedExpRange === "<3") matchesExp = exp < 3;
      else if (selectedExpRange === "3-5") matchesExp = exp >= 3 && exp <= 5;
      else if (selectedExpRange === ">5") matchesExp = exp > 5;

      const matchesBand = selectedBand === "ALL" || (emp.band || "").includes(selectedBand);

      const locCity = (emp.location || "").split(",")[0].trim();
      const matchesLocation = selectedLocation === "ALL" || locCity.toLowerCase() === selectedLocation.toLowerCase();

      const benchDays = getDaysOnBench(emp.benchSince);
      let matchesBenchAging = true;
      if (selectedBenchAging === "<14") matchesBenchAging = emp.availabilityStatus === "BENCH" && benchDays <= 14;
      else if (selectedBenchAging === "15-30") matchesBenchAging = emp.availabilityStatus === "BENCH" && benchDays > 14 && benchDays <= 30;
      else if (selectedBenchAging === ">30") matchesBenchAging = emp.availabilityStatus === "BENCH" && benchDays > 30;

      const matchesCert = !certOnly || (emp.certifications && emp.certifications.length > 0);

      return matchesSearch && matchesStatus && matchesSkill && matchesExp && matchesBand && matchesLocation && matchesBenchAging && matchesCert;
    });
  }, [employees, searchTerm, statusFilter, selectedSkill, selectedExpRange, selectedBand, selectedLocation, selectedBenchAging, certOnly]);

  // Table Column Sorting (Requirement 2.8)
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case "name":
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case "experience":
          valA = a.experienceYears || 0;
          valB = b.experienceYears || 0;
          return sortDirection === "asc" ? valA - valB : valB - valA;
        case "benchDays":
          valA = a.availabilityStatus === "BENCH" ? getDaysOnBench(a.benchSince) : -1;
          valB = b.availabilityStatus === "BENCH" ? getDaysOnBench(b.benchSince) : -1;
          return sortDirection === "asc" ? valA - valB : valB - valA;
        case "band":
          valA = getBandRank(a.band);
          valB = getBandRank(b.band);
          return sortDirection === "asc" ? valA - valB : valB - valA;
        case "status":
          valA = a.availabilityStatus;
          valB = b.availabilityStatus;
          return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        default:
          return 0;
      }
    });
  }, [filteredEmployees, sortField, sortDirection]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const benchEmployees = employees.filter((e) => e.availabilityStatus === "BENCH");
  const allocatedEmployees = employees.filter((e) => e.availabilityStatus === "ALLOCATED");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workforce Talent Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              {employees.length} Engineers Total
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
              {benchEmployees.length} on Bench
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
              {allocatedEmployees.length} Allocated
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Search, filter, and inspect enterprise engineering profiles, seniority bands, verified skills, and project allocations.
          </p>
        </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* 4.9: Visible Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              aria-label="Sort talent directory"
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="benchDays">Bench Idle (Longest First)</option>
              <option value="experience">Experience (Highest First)</option>
              <option value="band">Seniority Band (L6 to L3)</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            title="Export Workforce Roster to CSV"
            aria-label="Export talent to CSV"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Dense Table vs Card View Toggle */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "cards" 
                  ? "bg-blue-600 text-white shadow-xs" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
              title="Card Grid View"
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
              title="Enterprise Table View with Sorting"
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

      {/* 2.4: Semantic Badge Color Legend */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-200/80 flex-wrap gap-2">
        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Badge System Legend:</span>
        <div className="flex items-center gap-3 flex-wrap text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span className="font-medium text-slate-700">Technical Skills (Neutral Blue)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
            <span className="font-medium text-slate-700">Certifications (Violet)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="font-medium text-slate-700">On Bench</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-700">Allocated to SOW</span>
          </span>
        </div>
      </div>

      {/* 2.7: Search Bar and Primary Filters */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code (e.g. TM-04821), name, role, skill, project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Quick Status Tabs */}
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

            {/* Advanced Filters Toggle Button */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer shadow-2xs ${
                showAdvancedFilters || activeFilterCount > (statusFilter !== "ALL" ? 1 : 0)
                  ? "bg-blue-50 text-blue-800 border-blue-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Filter className="h-3.5 w-3.5 text-blue-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="h-4.5 w-4.5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                title="Reset All Filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2.7: Advanced Multi-Filter Drawer (Skill, Experience, Band, Location, Bench Aging) */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs animate-in fade-in duration-150">
            {/* Skill Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Competency Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                {allSkills.map(s => <option key={s} value={s}>{s === "ALL" ? "All Skills" : s}</option>)}
              </select>
            </div>

            {/* Experience Range */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Experience Range</label>
              <select
                value={selectedExpRange}
                onChange={(e) => setSelectedExpRange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">Any Experience</option>
                <option value="<3">&lt; 3 Years (Associate)</option>
                <option value="3-5">3–5 Years (Mid-Senior)</option>
                <option value=">5">&gt; 5 Years (Staff / Principal)</option>
              </select>
            </div>

            {/* Seniority Band */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Seniority Band</label>
              <select
                value={selectedBand}
                onChange={(e) => setSelectedBand(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                {allBands.map(b => <option key={b} value={b}>{b === "ALL" ? "All Bands" : `${b} Band`}</option>)}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Office</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                {allLocations.map(l => <option key={l} value={l}>{l === "ALL" ? "All Offices" : l}</option>)}
              </select>
            </div>

            {/* Bench Duration */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Bench Duration</label>
              <select
                value={selectedBenchAging}
                onChange={(e) => setSelectedBenchAging(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Aging</option>
                <option value="<14">&lt; 14 Days (Standard)</option>
                <option value="15-30">15–30 Days (Active)</option>
                <option value=">30">&gt; 30 Days (Critical)</option>
              </select>
            </div>

            {/* Certified Only Toggle */}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 cursor-pointer bg-slate-50 hover:bg-slate-100 h-9">
                <input
                  type="checkbox"
                  checked={certOnly}
                  onChange={(e) => setCertOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span className="font-bold text-slate-800 text-[11px] whitespace-nowrap">Certified Only</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Render Dense Enterprise Table View (Requirement 2.8) */}
      {viewMode === "table" ? (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100 min-w-[750px]">
              <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={filteredEmployees.length > 0 && selectedEmpIds.size === filteredEmployees.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all employees"
                      className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4"
                    />
                  </th>
                  <th 
                    onClick={() => toggleSort("name")}
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Engineer & ID</span>
                      {sortField === "name" ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </th>

                  <th 
                    onClick={() => toggleSort("band")}
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Seniority Band</span>
                      {sortField === "band" ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </th>

                  <th 
                    onClick={() => toggleSort("experience")}
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Prof. Experience</span>
                      {sortField === "experience" ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </th>

                  <th className="px-5 py-3.5">Base Office</th>
                  <th className="px-5 py-3.5">Skills & Credentials</th>

                  <th 
                    onClick={() => toggleSort("benchDays")}
                    className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status / Bench Idle</span>
                      {sortField === "benchDays" ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3.5 w-3.5 text-blue-600" /> : <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
                      ) : <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />}
                    </div>
                  </th>

                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No talent matches your filter criteria. Try clearing search filters.
                    </td>
                  </tr>
                ) : (
                  sortedEmployees.map((emp) => {
                    const isBench = emp.availabilityStatus === "BENCH";
                    const avatar = getAvatarColor(emp.name);
                    const initials = getInitials(emp.name);
                    const benchDays = getDaysOnBench(emp.benchSince);

                    return (
                      <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3 w-10">
                          <input
                            type="checkbox"
                            checked={selectedEmpIds.has(emp.id)}
                            onChange={(e) => toggleSelectEmployee(emp.id, e)}
                            aria-label={`Select ${emp.name}`}
                            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
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

                        <td className="px-5 py-3">
                          <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                            {emp.band}
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <span className="font-bold text-slate-900">{emp.experienceYears}y</span>
                          <span className="text-[11px] text-slate-400 block">career experience</span>
                        </td>

                        <td className="px-5 py-3 text-slate-700 font-medium">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span>{(emp.location || "Global Remote").split(",")[0]}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(emp.skills || []).slice(0, 3).map((s) => (
                              <span key={s.name} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeStyles.technicalSkill}`}>
                                {s.name}
                              </span>
                            ))}
                            {emp.certifications && emp.certifications.length > 0 && (
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badgeStyles.certification}`}>
                                ✦ {emp.certifications[0].split(" ")[0]}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-3">
                          {isBench ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="h-3 w-3" />
                              <span>{benchDays}d Idle</span>
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Allocated
                              </span>
                              <span className="block text-[11px] font-bold text-slate-800 mt-0.5 truncate max-w-[160px]" title={emp.assignedProjectName}>
                                {emp.assignedProjectName || "Active SOW"}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                              title="View full employee dossier"
                            >
                              Dossier
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditEmployee && onEditEmployee(emp);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer"
                              title="Edit Employee"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteEmployee && onDeleteEmployee(emp);
                              }}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                              title="Delete Employee"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2.2 & 2.3: Compact Cards View with Structured, Non-Crowded Information */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEmployees.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              No talent matches your filter criteria. Try clearing search filters.
            </div>
          ) : (
            sortedEmployees.map((emp) => {
              const isBench = emp.availabilityStatus === "BENCH";
              const avatar = getAvatarColor(emp.name);
              const initials = getInitials(emp.name);
              const benchDays = getDaysOnBench(emp.benchSince);
              const certs = emp.certifications || [];

              return (
                <div
                  key={emp.id}
                  className="rounded-2xl bg-white border border-slate-200/90 p-4.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs h-full"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedEmpIds.has(emp.id)}
                          onChange={(e) => toggleSelectEmployee(emp.id, e)}
                          aria-label={`Select ${emp.name}`}
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer h-4 w-4 mt-2.5"
                        />
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-xs ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                              {emp.empCode}
                            </span>
                            <h3 
                              onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                              className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer truncate"
                            >
                              {emp.name}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 truncate font-medium mt-0.5">{emp.role}</p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                          isBench
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300"
                        }`}
                      >
                        {isBench ? "On Bench" : "Allocated"}
                      </span>
                    </div>

                    {/* 2.3: Separate & Readable Information Groups (Seniority, Location, Exp, Bench Duration) */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Seniority Band</span>
                        <span className="font-bold text-indigo-700 text-[11px] truncate block">{emp.band}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Base Office</span>
                        <span className="font-semibold text-slate-700 text-[11px] flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-blue-500 shrink-0" />
                          <span>{(emp.location || "Global Remote").split(",")[0]}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Prof. Experience</span>
                        <span className="font-bold text-slate-900 text-[11px]">{emp.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          {isBench ? "Bench Idle Time" : "Assignment"}
                        </span>
                        {isBench ? (
                          <span className="font-extrabold text-amber-900 text-[11px]">{benchDays} Days Idle</span>
                        ) : (
                          <span className="font-extrabold text-emerald-800 text-[11px] truncate block" title={emp.assignedProjectName}>
                            {emp.assignedProjectName || "Committed SOW"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2.4: Skills Section (Neutral Blue Badges) */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1.5">
                        Technical Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(emp.skills || []).slice(0, 4).map((skill) => (
                          <span
                            key={skill.name}
                            className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${badgeStyles.technicalSkill}`}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 2.2: Compact Certifications (Showing Max 2 + '+X more' Chip) */}
                    {certs.length > 0 && (
                      <div className="pt-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {certs.slice(0, 2).map((cert) => (
                            <span
                              key={cert}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 ${badgeStyles.certification}`}
                            >
                              <ShieldCheck className="h-3 w-3 text-purple-600" />
                              <span className="truncate max-w-[130px]">{cert}</span>
                            </span>
                          ))}
                          {certs.length > 2 && (
                            <span 
                              className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200"
                              title={certs.slice(2).join(", ")}
                            >
                              +{certs.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onSelectEmployee && onSelectEmployee(emp)}
                        className="text-slate-600 hover:text-blue-600 font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="View Full Dossier"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-500" />
                        <span>Dossier</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEmployee && onEditEmployee(emp);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs px-2 py-0.5 rounded hover:bg-blue-50 cursor-pointer"
                        title="Edit Employee Profile"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEmployee && onDeleteEmployee(emp);
                        }}
                        className="text-rose-500 hover:text-rose-700 font-bold text-xs px-2 py-0.5 rounded hover:bg-rose-50 cursor-pointer"
                        title="Delete Employee"
                      >
                        Delete
                      </button>
                    </div>

                    {isBench ? (
                      <button
                        onClick={() => setActiveTab("matching")}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer border border-blue-200 shrink-0"
                      >
                        Find Project →
                      </button>
                    ) : (
                      <span className="text-emerald-800 font-bold text-xs flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Staffed</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
          {/* 4.10: Enterprise Bulk Action Floating Toolbar */}
      {selectedEmpIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-200 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center">
              {selectedEmpIds.size}
            </span>
            <span className="font-extrabold text-sm">{selectedEmpIds.size} Engineers Selected</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("matching")}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-white transition-all cursor-pointer shadow-sm shadow-blue-400"
            >
              Batch AI Match →
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-slate-200 border border-slate-600 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setSelectedEmpIds(new Set())}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white font-bold cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
