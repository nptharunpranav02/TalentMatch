import React, { useState, useEffect } from "react";
import { Search, Users, Briefcase, Sparkles, CheckSquare, X, ArrowRight, CornerDownLeft } from "lucide-react";

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="h-4 w-4 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, employee name, skill, or project..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs divide-y divide-slate-50">
          {/* Quick Navigation Commands */}
          <div className="py-2">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Navigation
            </span>
            <div className="space-y-0.5">
              <button
                onClick={() => { setActiveTab("matching"); onClose(false); }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                  <span>Open Candidate Matcher</span>
                </span>
                <CornerDownLeft className="h-3 w-3 text-slate-300" />
              </button>
              <button
                onClick={() => { setActiveTab("approvals"); onClose(false); }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-left transition-colors"
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="h-3.5 w-3.5 text-slate-500" />
                  <span>Review Pending Approvals</span>
                </span>
                <CornerDownLeft className="h-3 w-3 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Employees */}
          {matchingEmployees.length > 0 && (
            <div className="py-2">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Employees ({matchingEmployees.length})
              </span>
              <div className="space-y-0.5">
                {matchingEmployees.slice(0, 4).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      if (onSelectEmployee) onSelectEmployee(emp);
                      onClose(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-800 text-left transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{emp.name}</span>
                        <span className="text-[10px] text-slate-400">{emp.role}</span>
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s.name} className="text-[10px] text-slate-500 bg-slate-50 px-1 rounded">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">View profile →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {matchingProjects.length > 0 && (
            <div className="py-2">
              <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Projects ({matchingProjects.length})
              </span>
              <div className="space-y-0.5">
                {matchingProjects.slice(0, 3).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectForMatch(proj.id);
                      setActiveTab("matching");
                      onClose(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-800 text-left transition-colors"
                  >
                    <div>
                      <span className="font-medium text-slate-900">{proj.name}</span>
                      <span className="text-[10px] text-slate-400 block">{proj.client}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">Match Talent →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingEmployees.length === 0 && matchingProjects.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No matching employees or projects found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
