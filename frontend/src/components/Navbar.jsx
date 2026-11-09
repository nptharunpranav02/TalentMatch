import React from "react";
import { Users, Briefcase, GitPullRequest, CheckSquare, LayoutGrid } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, pendingCount }) {
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
            <div className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight">
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
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-800">Engineering Manager</p>
              <p className="text-[11px] text-slate-400">admin@company.com</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-semibold">
              EM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
