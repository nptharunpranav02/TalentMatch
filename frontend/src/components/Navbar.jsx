import React, { useState } from "react";
import { 
  Users, Briefcase, Sparkles, CheckSquare, LayoutGrid, Search, Globe, ChevronDown, 
  Building2, Check, Bell, Settings, User, LogOut, Menu, X, Shield, Clock, ExternalLink, RefreshCw, CheckCircle2, TrendingUp 
} from "lucide-react";
import { useOrg } from "../context/OrgContext";

export default function Navbar({ activeTab, setActiveTab, pendingCount, onOpenCommandPalette, onRefreshData, onOpenDemoDrawer }) {
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
    { id: "matching", label: "AI Matching", icon: Sparkles },
    { id: "approvals", label: "Approvals", icon: CheckSquare, badge: pendingCount },
    { id: "analytics", label: "Analytics", icon: TrendingUp }
  ];

  // 3.5: Enterprise Workforce Alerts
  const [notificationList, setNotificationList] = useState([
    {
      id: "notif-1",
      title: "Allocation Awaiting Managerial Sign-off",
      desc: "Elena Rostova proposed for Clinical Summary AI Pod (92% Match)",
      time: "10m ago",
      targetTab: "approvals",
      actionText: "Review Proposal",
      unread: true
    },
    {
      id: "notif-2",
      title: "Critical Bench Duration Alert (>45 Days)",
      desc: "David Okafor has been on bench for 46 days (Critical Cost Overhead)",
      time: "25m ago",
      targetTab: "employees",
      actionText: "View Dossier",
      unread: true
    },
    {
      id: "notif-3",
      title: "Skills Demand Spike: Python Developers",
      desc: "Three active project engagements require senior Python & PyTorch engineers",
      time: "1h ago",
      targetTab: "matching",
      actionText: "Run AI Match",
      unread: true
    },
    {
      id: "notif-4",
      title: "Project Milestone & Roll-off in 14 Days",
      desc: "Kenji Takahashi's Core Banking Phase 1 milestone completes in 14 days",
      time: "2h ago",
      targetTab: "projects",
      actionText: "Inspect SOW",
      unread: false
    },
    {
      id: "notif-5",
      title: "Unfilled SOW Pod Positions",
      desc: "Core Banking & UPI Payments Engine has 3 unfilled engineering positions",
      time: "4h ago",
      targetTab: "projects",
      actionText: "Fill Capacity",
      unread: false
    }
  ]);
  const [notificationTab, setNotificationTab] = useState("ALL"); // 'ALL' | 'UNREAD'
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  const unreadCount = notificationList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefreshData) onRefreshData();
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 400);
  };

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
              {/* Separate Developer/Demo Testing Area Trigger */}
              <button
                onClick={onOpenDemoDrawer}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                title="Open Developer & Demo Testing Suite"
              >
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Demo Suite</span>
              </button>

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
                    className="absolute right-0 mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-xs animate-in fade-in"
                  >
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="font-extrabold text-slate-900 text-xs">Workforce Notification Center</span>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center border-b border-slate-100 px-3 pt-2 gap-2 text-xs font-bold">
                      <button
                        onClick={() => setNotificationTab("ALL")}
                        className={`pb-1.5 border-b-2 transition-all cursor-pointer ${
                          notificationTab === "ALL"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        All Alerts ({notificationList.length})
                      </button>
                      <button
                        onClick={() => setNotificationTab("UNREAD")}
                        className={`pb-1.5 border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
                          notificationTab === "UNREAD"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <span>Unread</span>
                        <span className="px-1.5 py-0.1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          {unreadCount}
                        </span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      {notificationList
                        .filter(n => notificationTab === "ALL" || n.unread)
                        .map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              setActiveTab(n.targetTab);
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 hover:bg-blue-50/50 cursor-pointer transition-colors ${n.unread ? "bg-blue-50/25" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>}
                                <strong className="text-slate-900 text-xs font-bold block">{n.title}</strong>
                              </div>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">{n.desc}</p>
                            {n.actionText && (
                              <div className="mt-2 flex justify-end">
                                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded-md border border-blue-200 inline-flex items-center gap-1">
                                  <span>{n.actionText}</span>
                                  <span>→</span>
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Governance Telemetry</span>
                      <button 
                        onClick={() => {
                          setActiveTab("approvals");
                          setShowNotifications(false);
                        }}
                        className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Approvals Inbox →
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
