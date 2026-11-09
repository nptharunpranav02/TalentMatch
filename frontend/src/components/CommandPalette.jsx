import React, { useState, useEffect } from "react";
import { Search, Users, Briefcase, Sparkles, CheckSquare, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { getAvatarColor, getInitials, getSkillBadgeClass } from "../utils/skillColors";

export default function CommandPalette({
  isOpen,
  onClose,
  employees,
  projects,
  setActiveTab,
  setSelectedProjectForMatch,
  onSelectEmployee
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      (e.skills || []).some((s) => s.name.toLowerCase().includes(q))
  );

  const matchingProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      (p.requiredSkills || []).some((s) => s.name.toLowerCase().includes(q))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-start justify-center pt-20 px-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4.5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="h-4 w-4 text-blue-600 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search talent, skills, clients, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs divide-y divide-slate-100">
          {/* Quick Navigation Commands */}
          <div className="py-2 px-1">
            <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Navigation
            </span>
            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab("matching"); onClose(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50/70 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-slate-800">Open AI Candidate Matcher</span>
                </span>
                <CornerDownLeft className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => { setActiveTab("approvals"); onClose(false); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50/70 text-slate-700 text-left transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <CheckSquare className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-slate-800">Review Governance & Approvals</span>
                </span>
                <CornerDownLeft className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Employees */}
          {matchingEmployees.length > 0 && (
            <div className="py-2 px-1">
              <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                Talent Roster ({matchingEmployees.length})
              </span>
              <div className="space-y-1">
                {matchingEmployees.slice(0, 4).map((emp) => {
                  const avatar = getAvatarColor(emp.name);
                  const initials = getInitials(emp.name);
                  return (
                    <button
                      key={emp.id}
                      onClick={() => {
                        if (onSelectEmployee) onSelectEmployee(emp);
                        onClose(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50/60 text-slate-800 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-[10px] ${avatar.bg} ${avatar.text} ${avatar.border} border shrink-0`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 truncate">{emp.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">{emp.band}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{emp.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-blue-600 shrink-0">Dossier →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {matchingProjects.length > 0 && (
            <div className="py-2 px-1">
              <span className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                Client SOW Projects ({matchingProjects.length})
              </span>
              <div className="space-y-1">
                {matchingProjects.slice(0, 3).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectForMatch(proj.id);
                      setActiveTab("matching");
                      onClose(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-50/60 text-slate-800 text-left transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-blue-600">{proj.name}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">{proj.client}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-600">Match →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingEmployees.length === 0 && matchingProjects.length === 0 && (
            <div className="py-8 text-center text-slate-400 font-medium">
              No matching employees or projects found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Navigate with arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
