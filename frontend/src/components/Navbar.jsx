import React, { useState } from "react";
import { 
  Users, Briefcase, Sparkles, CheckSquare, LayoutGrid, Search, Globe, ChevronDown, 
  Building2, Check, Bell, Settings, User, LogOut, Menu, X, Shield, Clock, ExternalLink 
} from "lucide-react";
import { useOrg } from "../context/OrgContext";

export default function Navbar({ activeTab, setActiveTab, pendingCount, onOpenCommandPalette }) {
  const { orgName, updateOrgName, currency, currencies, setCurrency } = useOrg();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showOrgEdit, setShowOrgEdit] = useState(false);
  const [tempOrgName, setTempOrgName] = useState(orgName);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "employees", label: "Employees", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "matching", label: "AI Workspace", icon: Sparkles },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount }
  ];

  const notifications = [
    {
      id: "notif-1",
      title: "Allocation Pending Sign-off",
      desc: "Elena Rostova proposed for Clinical Summary AI Pod",
      time: "10m ago",
      targetTab: "approvals",
      unread: true
    },
    {
      id: "notif-2",
      title: "Critical Bench Duration Alert",
      desc: "David Okafor has reached 42 days idle on bench",
      time: "1h ago",
      targetTab: "employees",
      unread: true
    },
    {
      id: "notif-3",
      title: "SOW Capacity Milestone",
      desc: "Core Banking Engine is 1/4 staffed with L6 Architect",
      time: "3h ago",
      targetTab: "projects",
      unread: false
    }
  ];

  const handleSaveOrg = (e) => {
    e.preventDefault();
    if (tempOrgName.trim()) {
      updateOrgName(tempOrgName.trim());
      setShowOrgEdit(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Left: Brand Logo & Organization Name */}
            <div className="flex items-center gap-3 shrink-0">
              <div 
                className="flex items-center gap-2.5 cursor-pointer group" 
                onClick={() => setActiveTab("dashboard")}
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-md shadow-blue-200 relative shrink-0">
                  <span>TM</span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white shadow-2xs"></span>
                </div>
                <div>
                  <span className="font-extrabold text-base text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors flex items-center">
                    Talent<span className="text-blue-600">Match</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-2xs">
                      AI
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    Enterprise Allocation
                  </span>
                </div>
              </div>

              {/* 2.1: Full Company Name Display with Tooltip & Edit Trigger */}
              <div className="hidden lg:flex items-center pl-3 border-l border-slate-200 text-xs">
                {showOrgEdit ? (
                  <form onSubmit={handleSaveOrg} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempOrgName}
                      onChange={(e) => setTempOrgName(e.target.value)}
                      className="px-2.5 py-1 border border-blue-500 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs w-48"
                      placeholder="Enter company name..."
                      autoFocus
                    />
                    <button type="submit" className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs">
                      Save
                    </button>
                    <button type="button" onClick={() => setShowOrgEdit(false)} className="text-slate-400 text-xs hover:text-slate-600 cursor-pointer">
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowOrgEdit(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold cursor-pointer transition-colors max-w-[220px]"
                    title={`Organization: ${orgName} (Click to edit)`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{orgName}</span>
                  </button>
                )}
              </div>
            </div>

            {/* 2.1: Quick Search with Generous Minimum Width */}
            <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm justify-center mx-2">
              <button
                onClick={onOpenCommandPalette}
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Search className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-600 truncate">Search talent, skills, SOWs...</span>
                </span>
                <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded shadow-2xs shrink-0">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Navigation Links with Balanced, Consistent Active Styling */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`ml-1 inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive ? "bg-amber-400 text-amber-950" : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons: Currency + Notifications + Profile + Mobile Hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Global Currency Switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => {
                    setShowCurrencyMenu(!showCurrencyMenu);
                    setShowNotifications(false);
                    setShowUserMenu(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                  title="Select Currency Locale"
                >
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  <span>{currency.code}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {showCurrencyMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in"
                    onClick={() => setShowCurrencyMenu(false)}
                  >
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Select Currency Locale
                    </div>
                    {Object.values(currencies).map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-blue-50 text-slate-800 text-left cursor-pointer transition-colors"
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

              {/* 2.1: Visible Notification Area with Badge & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowCurrencyMenu(false);
                    setShowUserMenu(false);
                  }}
                  className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs transition-colors"
                  title="Notifications & Telemetry Alerts"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </button>

                {showNotifications && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in"
                    onClick={() => setShowNotifications(false)}
                  >
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="font-extrabold text-slate-900">Workforce Notifications</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        2 unread
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div 
                          key={n.id}
                          onClick={() => setActiveTab(n.targetTab)}
                          className={`p-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/20" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <strong className="text-slate-900 text-xs font-bold block">{n.title}</strong>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-relaxed">{n.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                      <button 
                        onClick={() => setActiveTab("approvals")}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        View Governance Inbox →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 2.1: Obvious User Profile Menu Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowCurrencyMenu(false);
                  }}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
                  title="User Profile & Settings"
                >
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                    AC
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 mr-1 hidden sm:inline" />
                </button>

                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                      <p className="font-extrabold text-slate-900 text-sm">Alex Carter</p>
                      <p className="text-slate-500 text-xs font-medium">VP of Resource Operations</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-300">
                        <Shield className="h-3 w-3" />
                        <span>Director Authorization Tier</span>
                      </span>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => setShowSettingsModal(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-500" />
                        <span>Enterprise Settings</span>
                      </button>

                      <button
                        onClick={() => setShowOrgEdit(true)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer transition-colors"
                      >
                        <Building2 className="h-4 w-4 text-slate-500" />
                        <span>Rename Organization</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>TalentMatch v2.4 (Enterprise)</span>
                      <span className="text-emerald-600 font-bold">● Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile / Tablet Hamburger Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="xl:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 cursor-pointer shadow-2xs"
                title="Toggle Menu"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Navigation Sheet */}
        {showMobileMenu && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <button
              onClick={() => { onOpenCommandPalette(); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-medium"
            >
              <Search className="h-4 w-4 text-blue-600" />
              <span>Search talent, skills, SOWs...</span>
            </button>

            <nav className="grid grid-cols-2 gap-2 pt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white shadow-sm" 
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Enterprise Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Enterprise Configuration</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Company / Organization Title</label>
                <input 
                  type="text" 
                  value={tempOrgName} 
                  onChange={(e) => setTempOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Financial Currency</label>
                <select 
                  value={currency.code}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold bg-white"
                >
                  {Object.values(currencies).map(c => (
                    <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
                <p className="font-bold text-slate-800">Compliance & Telemetry</p>
                <p>• SOC2 Type II Audit Logging: Active</p>
                <p>• Multi-Factor Vector Engine: Explainable Mode</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (tempOrgName.trim()) updateOrgName(tempOrgName.trim());
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm shadow-blue-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
