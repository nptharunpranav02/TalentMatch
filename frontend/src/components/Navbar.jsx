import React from "react";
import { Users, Briefcase, GitPullRequest, CheckSquare, LayoutGrid, Search } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, pendingCount, onOpenCommandPalette }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "matching", label: "Matching", icon: GitPullRequest },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer" 
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              TM
            </div>
            <div>
              <span className="font-semibold text-base text-slate-900 tracking-tight">
                TalentMatch
              </span>
              <span className="ml-2 text-xs text-slate-400 font-normal hidden sm:inline">
                Resource Allocation
              </span>
            </div>
          </div>

          {/* Center: Command Palette Trigger (Hackathon Winner Feature!) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs transition-colors cursor-pointer w-64 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search talent, projects...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded">
              Ctrl K
            </kbd>
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-medium"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
