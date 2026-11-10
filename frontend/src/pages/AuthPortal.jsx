import React, { useState } from "react";
import { 
  Building2, ShieldCheck, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, 
  Layers, Users, Briefcase, Globe, AlertCircle, KeyRound, Server 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthPortal() {
  const { login, register, availableOrgs } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"

  // Login form state
  const [loginEmail, setLoginEmail] = useState("admin@apexfinancial.io");
  const [loginPassword, setLoginPassword] = useState("password123");

  // Registration form state
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("Fintech & Banking Systems");
  const [seedStarter, setSeedStarter] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setOrgName(val);
    setOrgSlug(val.toLowerCase().replace(/[^a-z0-9]/g, "-"));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in to organization workspace.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, defaultPassword = "password123") => {
    setLoginEmail(email);
    setLoginPassword(defaultPassword);
    setLoading(true);
    setErrorMessage(null);
    try {
      await login(email, defaultPassword);
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign in to organization workspace.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await register({
        name: orgName,
        slug: orgSlug,
        email: adminEmail,
        password,
        industry,
        adminName,
        seedStarter
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to register organization workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-extrabold text-base tracking-tight shadow-lg shadow-blue-500/25 border border-blue-400/30">
            <span>TM</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                Talent<span className="text-blue-400">Match</span> AI
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
                Multi-Tenant Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Dedicated Organization Workspaces & Workforce Allocation Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Backend Gateway Active</span>
          </span>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Hero Briefing Column (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-b from-blue-950/70 via-indigo-950/50 to-slate-900 border-b lg:border-b-0 lg:border-r border-slate-700/60 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                <span>Isolated Enterprise Tenants</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                Dedicated Space For Your Organization
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-medium">
                TalentMatch AI provides secure, isolated multi-tenant environments. Maintain your own employee rosters, configure custom project requirements, and run explainable AI allocation matching.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Data Isolation:</strong> Your employees and projects are stored exclusively in your organization's backend space.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Full Employee Maintenance:</strong> Input real employee profiles, assign competencies L1–L5, and track bench duration.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Fractional FTE Allocation:</strong> Allocate talent across 100%, 50%, or 25% pods with live WebSocket synchronization.</span>
              </div>
            </div>

            {/* Quick Demo Organization Switcher (Instant Evaluation for Judges) */}
            <div className="pt-4 border-t border-slate-700/60">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                ⚡ Instant Demo Enterprise Spaces (Click to enter):
              </span>
              <div className="space-y-1.5">
                {[
                  {
                    name: "Apex Financial Global",
                    email: "admin@apexfinancial.io",
                    industry: "Fintech & Banking Systems",
                    badge: "5 Engineers • 1 Project"
                  },
                  {
                    name: "Helix Healthcare IT",
                    email: "admin@helixhealth.io",
                    industry: "Clinical Diagnostics & Health AI",
                    badge: "2 Engineers • 1 Project"
                  },
                  {
                    name: "TechNova Cloud Systems",
                    email: "admin@technova.io",
                    industry: "Cloud & DevOps Platforms",
                    badge: "1 Architect • 1 Project"
                  }
                ].map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleQuickLogin(demo.email)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-blue-900/40 border border-slate-700 hover:border-blue-500/50 transition-all text-xs flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <strong className="text-white group-hover:text-blue-300 transition-colors block text-xs">
                        {demo.name}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-mono">{demo.email}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 shrink-0">
                      Enter Space →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-800/90 p-1 border border-slate-700 mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setErrorMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "login" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Sign In to Organization</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("register"); setErrorMessage(null); }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authMode === "register" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Register New Space</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 font-bold animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: Organization Sign In */}
            {authMode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Organization Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. admin@apexfinancial.io or admin@yourcompany.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300">
                      Organization Master Password *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">Demo: password123</span>
                  </div>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="Enter organization password..."
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <span>{loading ? "Authenticating Dedicated Workspace..." : "Access Dedicated Organization Space"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: Register New Dedicated Organization Workspace */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Global Technologies"
                      value={orgName}
                      onChange={handleNameChange}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Workspace Slug / Domain *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. acme-tech"
                      value={orgSlug}
                      onChange={(e) => setOrgSlug(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Admin Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Admin Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@acme.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Industry Domain
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                    >
                      <option value="Fintech & Banking Systems">Fintech & Banking Systems</option>
                      <option value="Clinical Diagnostics & Health AI">Clinical Diagnostics & Health AI</option>
                      <option value="Enterprise Cloud & Platform Engineering">Enterprise Cloud & Platform Engineering</option>
                      <option value="Omnichannel Retail & E-Commerce">Omnichannel Retail & E-Commerce</option>
                      <option value="Telecommunications & Media">Telecommunications & Media</option>
                      <option value="Custom IT Services & Consulting">Custom IT Services & Consulting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Master Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Workspace Initial Template Selection */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Workspace Initialization Mode:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      !seedStarter 
                        ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-400" 
                        : "bg-slate-800 border-slate-700 hover:bg-slate-750"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="starterMode"
                          checked={!seedStarter}
                          onChange={() => setSeedStarter(false)}
                          className="accent-blue-500"
                        />
                        <strong className="text-white text-xs">Blank Space (Custom)</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 pl-5">
                        Clean slate. Input and maintain your real organization employees.
                      </p>
                    </label>

                    <label className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      seedStarter 
                        ? "bg-blue-600/20 border-blue-500 ring-1 ring-blue-400" 
                        : "bg-slate-800 border-slate-700 hover:bg-slate-750"
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="starterMode"
                          checked={seedStarter}
                          onChange={() => setSeedStarter(true)}
                          className="accent-blue-500"
                        />
                        <strong className="text-white text-xs">Pre-load Starter Pod</strong>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 pl-5">
                        Loads starter sample team so you can test AI matching immediately.
                      </p>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                  >
                    <span>{loading ? "Provisioning Dedicated Workspace..." : "Create Organization Workspace & Sign In"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Security & Multi-Tenant Compliance Footer */}
      <footer className="max-w-6xl w-full mx-auto py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-blue-400" />
          <span>TalentMatch Multi-Tenant Enterprise Gateway • Dedicated Organization Partitioning</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Encrypted Credentials</span>
          <span>•</span>
          <span>Zero-Cross Tenant Leakage</span>
          <span>•</span>
          <span>FTE Fractional Modeling</span>
        </div>
      </footer>
    </div>
  );
}
