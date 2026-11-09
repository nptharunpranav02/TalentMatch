import React, { useState } from "react";
import { Users, Briefcase, GitPullRequest, CheckSquare, LayoutGrid, Search, Globe, ChevronDown, Building2, Check } from "lucide-react";
import { useOrg } from "../context/OrgContext";

export default function Navbar({ activeTab, setActiveTab, pendingCount, onOpenCommandPalette }) {
  const { orgName, updateOrgName, currency, currencies, setCurrency } = useOrg();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showOrgEdit, setShowOrgEdit] = useState(false);
  const [tempOrgName, setTempOrgName] = useState(orgName);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "matching", label: "Matching", icon: GitPullRequest },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount }
  ];

  const handleSaveOrg = (e) => {
    e.preventDefault();
    if (tempOrgName.trim()) {
      updateOrgName(tempOrgName.trim());
      setShowOrgEdit(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Brand Logo & Universal Workspace Indicator */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setActiveTab("dashboard")}
            >
              <div className="h-8.5 w-8.5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs relative">
                <span>TM</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div>
                <span className="font-semibold text-base text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                  TalentMatch
                </span>
                <span className="ml-2 text-xs text-slate-400 font-normal hidden lg:inline">
                  Enterprise Allocation
                </span>
              </div>
            </div>

            {/* Editable Organization Name Tag */}
            <div className="hidden sm:flex items-center pl-2 border-l border-slate-200 text-xs">
              {showOrgEdit ? (
                <form onSubmit={handleSaveOrg} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempOrgName}
                    onChange={(e) => setTempOrgName(e.target.value)}
                    className="px-2 py-0.5 border border-blue-400 rounded text-xs text-slate-900 bg-white focus:outline-none"
                    placeholder="Enter company name..."
                    autoFocus
                  />
                  <button type="submit" className="px-2 py-0.5 bg-slate-900 text-white rounded text-[10px] font-semibold">
                    Save
                  </button>
                  <button type="button" onClick={() => setShowOrgEdit(false)} className="text-slate-400 text-[10px]">
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowOrgEdit(true)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium cursor-pointer"
                  title="Click to rename organization"
                >
                  <Building2 className="h-3 w-3 text-slate-400" />
                  <span className="max-w-[140px] truncate">{orgName}</span>
                </button>
              )}
            </div>
          </div>

          {/* Center: Universal Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/90 text-slate-400 hover:text-slate-600 text-xs transition-colors cursor-pointer w-56 justify-between"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Quick search...</span>
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
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-900 font-medium border border-blue-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-700" : "text-slate-400"}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Global Currency & Localization Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              title="Change Global Currency"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>{currency.code} ({currency.symbol})</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {showCurrencyMenu && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                onClick={() => setShowCurrencyMenu(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Select Currency Locale
                </div>
                {Object.values(currencies).map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-slate-800 text-left cursor-pointer"
                  >
                    <span>{curr.label}</span>
                    {currency.code === curr.code && (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
