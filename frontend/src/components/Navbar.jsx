import React, { useState } from "react";
import { Users, Briefcase, CheckSquare, LayoutGrid, Search, Globe, ChevronDown, Building2, Check, Sparkles, UserRound } from "lucide-react";
import { useOrg } from "../context/OrgContext";

export default function Navbar({ activeTab, setActiveTab, pendingCount, onOpenCommandPalette, currentUser }) {
  const { orgName, currency, currencies, setCurrency } = useOrg();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "matching", label: "AI Workspace", icon: Sparkles },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount }
  ];



  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Universal Workspace Indicator */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveTab("dashboard")}
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-blue-200 relative">
                <span>TM</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white shadow-2xs"></span>
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                  Talent<span className="text-blue-600">Match</span>
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-2xs">
                    AI
                  </span>
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal hidden lg:inline">
                  Workforce Intelligence
                </span>
              </div>
            </div>

            {/* Company identity is resolved from the authenticated admin account. */}
            <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-600">
              <Building2 className="h-3.5 w-3.5 text-blue-500" />
              <span className="max-w-[190px] truncate font-semibold text-slate-700">{orgName}</span>
            </div>
          </div>

          {/* Center: Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/90 text-slate-400 hover:text-slate-600 text-xs transition-colors cursor-pointer w-60 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium text-slate-500">Quick search talent...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          {/* Navigation Links with Bright Confident Styling */}
          <nav className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge > 0 && (
                    <span className={`ml-1 inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive ? "bg-amber-400 text-amber-950" : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Global Currency & Localization Selector with Bright Pill */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              title="Change Global Currency"
            >
              <Globe className="h-3.5 w-3.5 text-blue-600" />
              <span>{currency.code} ({currency.symbol})</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showCurrencyMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                onClick={() => setShowCurrencyMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Currency Locale
                </div>
                {Object.values(currencies).map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-blue-50/60 text-slate-800 text-left cursor-pointer transition-colors"
                  >
                    <span className="font-medium">{curr.label}</span>
                    {currency.code === curr.code && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Logged-in User Role Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5
  rounded-lg border border-slate-200 bg-white">

            <div className="h-8 w-8 rounded-full bg-blue-100
    flex items-center justify-center">
              <UserRound className="h-4 w-4 text-blue-700" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">
                {currentUser?.name || currentUser?.email || "User"}
              </span>

              <span className={`text-[10px] font-black uppercase tracking-wider ${currentUser?.role === "admin"
                  ? "text-emerald-600"
                  : "text-blue-600"
                }`}>
                {currentUser?.role || "Unknown Role"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
