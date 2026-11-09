import React from "react";
import { LayoutDashboard, Users, Briefcase, Sparkles, CheckSquare, Layers } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, pendingCount }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "matching", label: "AI Matcher", icon: Sparkles, highlight: true },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                  Talent<span className="text-indigo-600">Match</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  AI Allocator
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Intelligent Bench & Project Allocation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? item.highlight
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-300"
                        : "bg-slate-900 text-white shadow-xs"
                      : item.highlight
                      ? "text-indigo-600 hover:bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-current" : item.highlight ? "text-indigo-600" : "text-slate-500"}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-amber-500 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Role Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/80">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-xs border border-indigo-200">
                M1
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-800">Admin / Manager</p>
                <p className="text-slate-500">Resource Ops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
