import React, { useState, useMemo } from "react";
import { 
  Plus, Search, Calendar, Users, MapPin, DollarSign, Building2, 
  AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Filter, RotateCcw, ChevronDown, ChevronUp 
} from "lucide-react";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import { useOrg } from "../context/OrgContext";

export default function Projects({ projects, employees, onOpenAddProject, setActiveTab, setSelectedProjectForMatch }) {
  const { formatMoney } = useOrg();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 2.7: Advanced Filters for Projects
  const [selectedSkill, setSelectedSkill] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [selectedClient, setSelectedClient] = useState("ALL");
  const [selectedExpFilter, setSelectedExpFilter] = useState("ALL");

  // 2.6: Expandable Project Descriptions
  const [expandedDescMap, setExpandedDescMap] = useState({});

  const toggleExpandDesc = (projId) => {
    setExpandedDescMap((prev) => ({ ...prev, [projId]: !prev[projId] }));
  };

  // Extract unique filters
  const allRequiredSkills = useMemo(() => {
    const s = new Set();
    projects.forEach(p => (p.requiredSkills || []).forEach(sk => s.add(sk.name)));
    return ["ALL", ...Array.from(s).sort()];
  }, [projects]);

  const allClients = useMemo(() => {
    const c = new Set();
    projects.forEach(p => { if (p.client) c.add(p.client); });
    return ["ALL", ...Array.from(c).sort()];
  }, [projects]);

  const activeFilterCount = (statusFilter !== "ALL" ? 1 : 0) +
    (selectedSkill !== "ALL" ? 1 : 0) +
    (selectedPriority !== "ALL" ? 1 : 0) +
    (selectedClient !== "ALL" ? 1 : 0) +
    (selectedExpFilter !== "ALL" ? 1 : 0);

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setSelectedSkill("ALL");
    setSelectedPriority("ALL");
    setSelectedClient("ALL");
    setSelectedExpFilter("ALL");
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q ||
        proj.name.toLowerCase().includes(q) ||
        (proj.projectCode || "").toLowerCase().includes(q) ||
        proj.client.toLowerCase().includes(q) ||
        proj.description.toLowerCase().includes(q) ||
        (proj.requiredSkills || []).some((s) => s.name.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || proj.status === statusFilter;
      const matchesSkill = selectedSkill === "ALL" ||
        (proj.requiredSkills || []).some((s) => s.name.toLowerCase() === selectedSkill.toLowerCase());

      const matchesPriority = selectedPriority === "ALL" || proj.priority === selectedPriority;
      const matchesClient = selectedClient === "ALL" || proj.client === selectedClient;

      const minExp = proj.minExperienceYears || 0;
      let matchesExp = true;
      if (selectedExpFilter === "<=3") matchesExp = minExp <= 3;
      else if (selectedExpFilter === ">3") matchesExp = minExp > 3;

      return matchesSearch && matchesStatus && matchesSkill && matchesPriority && matchesClient && matchesExp;
    });
  }, [projects, searchTerm, statusFilter, selectedSkill, selectedPriority, selectedClient, selectedExpFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Client Engagements & SOW Portfolio</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
              {projects.length} Active SOWs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage project staffing quotas, monitor billable utilization rates, and allocate bench engineers.
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
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code (e.g. PRJ-FIN-8021), client, deliverables, stack..."
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
                All ({projects.length})
              </button>
              <button
                onClick={() => setStatusFilter("OPEN")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
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
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
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

        {/* 2.7: Advanced Multi-Filter Drawer for Projects */}
        {showAdvancedFilters && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Required Competency</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                {allRequiredSkills.map(s => <option key={s} value={s}>{s === "ALL" ? "All Required Skills" : s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">SOW Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical SOW</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Client Partner</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                {allClients.map(c => <option key={c} value={c}>{c === "ALL" ? "All Clients" : c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Min Exp Threshold</label>
              <select
                value={selectedExpFilter}
                onChange={(e) => setSelectedExpFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none"
              >
                <option value="ALL">Any Requirement</option>
                <option value="<=3">&le; 3 Years (Mid-level)</option>
                <option value=">3">&gt; 3 Years (Senior / Lead)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2.5: Compact, Shorter Project Cards with Clean Vertical Padding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No project engagements match the selected filters. Try clearing search filters.
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const assignedList = (employees || []).filter(
              (e) => e.assignedProjectId === proj.id && e.availabilityStatus === "ALLOCATED"
            );
            const allocated = assignedList.length;
            const percent = Math.min(Math.round((allocated / proj.teamSize) * 100), 100);
            const isFulfilled = allocated >= proj.teamSize;
            const unfilledSeats = Math.max(0, proj.teamSize - allocated);
            const isDescExpanded = Boolean(expandedDescMap[proj.id]);

            return (
              <div
                key={proj.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-4.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group shadow-2xs h-full"
              >
                <div className="space-y-3">
                  {/* Card Header: Client & Priority */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                          {proj.projectCode || "PRJ-GEN"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 truncate">
                          <Building2 className="h-3 w-3 text-blue-600 shrink-0" />
                          <span className="truncate">{proj.client}</span>
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900 mt-1.5 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                        {proj.name}
                      </h2>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {proj.domain || "Enterprise IT"} • {proj.engagementModel || "Dedicated Pod"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                      {proj.priority === "Critical" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
                          Critical SOW
                        </span>
                      )}
                      {proj.priority === "High" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          High Priority
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs ${
                          isFulfilled
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : "bg-blue-100 text-blue-900 border-blue-300"
                        }`}
                      >
                        {isFulfilled ? "Filled" : "Active Hiring"}
                      </span>
                    </div>
                  </div>

                  {/* 2.6: Description limited to 2 lines with 'View Details' expander */}
                  <div className="text-xs text-slate-600 leading-relaxed font-medium">
                    <p className={isDescExpanded ? "" : "line-clamp-2"}>
                      {proj.description}
                    </p>
                    <button
                      onClick={() => toggleExpandDesc(proj.id)}
                      className="text-blue-600 hover:text-blue-800 text-[11px] font-bold inline-flex items-center gap-0.5 mt-0.5 cursor-pointer"
                    >
                      <span>{isDescExpanded ? "Show Less" : "View Full SOW Scope"}</span>
                      {isDescExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>

                  {/* Capacity Fill Meter */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-700 font-bold text-[11px]">Staffing Capacity</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {allocated} of {proj.teamSize} Allocated ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFulfilled ? "bg-emerald-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 2.5: Compact Metadata Strip */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Min Tenure</span>
                      <strong className="text-slate-900 font-bold text-[11px]">{proj.minExperienceYears}y exp</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Band</span>
                      <strong className="text-indigo-700 font-bold text-[11px]">{proj.targetBand || "L4+"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Billing Rate</span>
                      <strong className="text-blue-700 font-bold text-[11px]">{formatMoney(proj.monthlyRevenuePerDev || 14000)}/mo</strong>
                    </div>
                  </div>

                  {/* 2.4: Required Skills Badges (Green Semantic Style) */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">
                      Required Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.requiredSkills.map((req) => (
                        <span
                          key={req.name}
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${badgeStyles.requiredSkill}`}
                        >
                          {req.name} (L{req.minProficiency})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2.5: Aligned Action Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-xs font-medium text-slate-500">
                    {isFulfilled ? (
                      <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>SOW fully staffed</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 font-bold">
                        {unfilledSeats} unfilled seat{unfilledSeats > 1 ? "s" : ""}
                      </span>
                    )}
                  </span>

                  {isFulfilled ? (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                      Staffed
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProjectForMatch(proj.id);
                        setActiveTab("matching");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
                    >
                      <span>Match Talent</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
