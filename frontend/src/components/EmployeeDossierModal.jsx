import React, { useState, useEffect } from "react";
import { 
  X, Mail, Award, Clock, ArrowRight, Compass, CheckCircle2, ShieldCheck, 
  MapPin, Briefcase, Star, TrendingUp, AlertTriangle, BookOpen, Layers, 
  DollarSign, Check, ExternalLink, Calendar, Building2, User
} from "lucide-react";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import { getBenchRiskTier } from "../services/mockData";
import { useOrg } from "../context/OrgContext";
import { api } from "../services/api";

export default function EmployeeDossierModal({
  employee,
  isOpen,
  onClose,
  onSelectProjectForMatch,
  onAllocateEmployee
}) {
  const { formatMoney } = useOrg();
  const [projectMatches, setProjectMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'skills' | 'history' | 'recommendations'

  useEffect(() => {
    if (isOpen && employee?.id) {
      setLoadingMatches(true);
      api.getEmployeeProjectRecommendations(employee.id)
        .then((recs) => setProjectMatches(recs || []))
        .catch((err) => console.error("Failed to load project matches", err))
        .finally(() => setLoadingMatches(false));
    }
  }, [isOpen, employee?.id]);

  if (!isOpen || !employee) return null;

  const isBench = employee.availabilityStatus === "BENCH";

  const calculateBenchDays = (dateStr) => {
    if (!dateStr) return 0;
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const benchDays = isBench ? calculateBenchDays(employee.benchSince) : 0;
  const riskTier = isBench ? getBenchRiskTier(benchDays) : null;
  const baseDailyCostUSD = 160;
  const totalIdleCostUSD = benchDays * baseDailyCostUSD;
  const monthlyBillableRunRateUSD = 15000;
  const avatar = getAvatarColor(employee.name);
  const initials = getInitials(employee.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 sm:px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Dossier"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl ${avatar.bg} ${avatar.text} ${avatar.border} border-2 shadow-lg shrink-0`}>
              {initials}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-white/15 text-white font-bold border border-white/20">
                  {employee.empCode || "TM-04821"}
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">{employee.name}</h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {employee.band || "L4 / Senior SDE"}
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white">{employee.role}</span>
                <span>•</span>
                <span>{employee.department || "Enterprise Engineering"}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  <span>{employee.location || "Global Remote"}</span>
                </span>
              </p>

              {/* Status & Risk Badges */}
              <div className="flex items-center gap-2.5 pt-1 flex-wrap">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold border shadow-xs ${
                    isBench
                      ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                      : "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
                  }`}
                >
                  {isBench ? "● On Bench (Immediate Availability)" : "● Allocated to SOW"}
                </span>

                {isBench && riskTier && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs ${riskTier.badgeClass}`}>
                    Bench Risk: {riskTier.tier} ({riskTier.tag})
                  </span>
                )}

                {employee.performanceRating && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-300 fill-amber-300" />
                    <span>{employee.performanceRating}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Dossier Tabs Navigation */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "skills"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Skills & Proficiencies ({employee.skills?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "history"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Past Projects & Portfolio ({employee.pastProjects?.length || employee.previousProjects?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "recommendations"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-amber-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>Recommended SOWs</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                {projectMatches.length}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Bench Risk & Cost Mitigation Alert Card (Section 3.3) */}
              {isBench && riskTier && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-300/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <span className="font-extrabold text-sm text-slate-900">
                        Bench Telemetry & Cost Exposure Assessment
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${riskTier.badgeClass}`}>
                      Status: {riskTier.tier}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">
                    {riskTier.action}. Allocating this talent recovers billable engagement run-rate immediately.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-xl border border-amber-200/80 shadow-2xs">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Bench Duration</span>
                      <strong className="text-lg font-black text-amber-950">{benchDays} Days</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-200/80 shadow-2xs">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Accrued Idle Cost</span>
                      <strong className="text-lg font-black text-rose-600">{formatMoney(totalIdleCostUSD)}</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-blue-200/80 shadow-2xs">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Billable Rate</span>
                      <strong className="text-lg font-black text-blue-700">{formatMoney(monthlyBillableRunRateUSD)} / mo</strong>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-2xs">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Staffing Readiness</span>
                      <strong className="text-lg font-black text-emerald-700">Immediate</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal & Corporate Identity Grid */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/70 space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Corporate Professional Dossier
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block">Corporate Email</span>
                    <strong className="text-slate-900 font-bold text-sm">{employee.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Department / Practice</span>
                    <strong className="text-slate-900 font-bold text-sm">{employee.department || "Enterprise Web Engineering"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Seniority Band / Grade</span>
                    <strong className="text-indigo-700 font-bold text-sm">{employee.band || "L4 / Senior SDE"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Verified Career Experience</span>
                    <strong className="text-slate-900 font-bold text-sm">{employee.experienceYears} Years</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Current SOW Assignment</span>
                    {employee.assignedProjectName ? (
                      <strong className="text-emerald-700 font-bold text-sm block truncate" title={employee.assignedProjectName}>
                        {employee.assignedProjectName}
                      </strong>
                    ) : (
                      <strong className="text-amber-800 font-bold text-sm">Unallocated (Bench Pool)</strong>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Base Office & Timezone</span>
                    <strong className="text-slate-900 font-bold text-sm">{employee.location || "Global Remote"}</strong>
                  </div>
                </div>
              </div>

              {/* Career Interests & Growth Focus */}
              {employee.careerInterests && employee.careerInterests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Career Aspirations & Growth Vectors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {employee.careerInterests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs flex items-center gap-1.5"
                      >
                        <Compass className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{interest}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Preview */}
              {employee.certifications && employee.certifications.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Verified Industry Certifications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {employee.certifications.map((cert) => (
                      <div
                        key={cert}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 shadow-2xs ${badgeStyles.certification}`}
                      >
                        <ShieldCheck className="h-5 w-5 text-purple-600 shrink-0" />
                        <div>
                          <strong className="text-purple-950 font-bold block">{cert}</strong>
                          <span className="text-[10px] text-purple-700 font-medium">Enterprise Verified Credential</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TECHNICAL SKILLS & PROFICIENCY LEVELS (Section 3.4) */}
          {activeTab === "skills" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Technical Competencies & Verified Proficiency</h3>
                  <p className="text-xs text-slate-500">Scale: Beginner (L1) → Intermediate (L2) → Proficient (L3) → Advanced (L4) → Expert (L5)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
                  {employee.skills?.length || 0} Evaluated Skills
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(employee.skills || []).map((skill) => {
                  const percent = (skill.proficiency / 5) * 100;
                  return (
                    <div 
                      key={skill.name} 
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeStyles.technicalSkill}`}>
                          {skill.name}
                        </span>
                        <span className="text-xs font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {skill.proficiencyLabel || "Proficient"} (L{skill.proficiency})
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-0.5">
                        <span>Hands-on Experience: <strong className="text-slate-800 font-bold">{skill.years || 2} Years</strong></span>
                        <span>Evaluation Confidence: <strong className="text-emerald-700 font-bold">Verified</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT HISTORY & PAST CLIENT PORTFOLIO (Section 3.1) */}
          {activeTab === "history" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Past Project Engagements & Delivery History</h3>
                  <p className="text-xs text-slate-500">Audited track record of client deliverables, responsibilities, and delivered stacks.</p>
                </div>
              </div>

              {employee.pastProjects && employee.pastProjects.length > 0 ? (
                <div className="space-y-3">
                  {employee.pastProjects.map((p, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <h4 className="font-extrabold text-sm text-slate-900">{p.client}</h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <span className="font-bold text-slate-800">Role:</span>
                        <span className="text-indigo-700 font-bold">{p.role}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs pt-1">
                        <span className="font-bold text-slate-500 text-[11px]">Stack:</span>
                        <div className="flex flex-wrap gap-1">
                          {p.tech.split(",").map((t) => (
                            <span key={t.trim()} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {t.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : employee.previousProjects && employee.previousProjects.length > 0 ? (
                <div className="space-y-2">
                  {employee.previousProjects.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800">
                      {p}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
                  No previous client engagements recorded.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECOMMENDED SOW PROJECTS WITH 1-CLICK ALLOCATE (Section 3.1) */}
          {activeTab === "recommendations" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">AI-Ranked SOW Engagements for {employee.name}</h3>
                  <p className="text-xs text-slate-500">Live multi-vector matching score calculated against active client requirements.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {projectMatches.length} Active SOWs
                </span>
              </div>

              {loadingMatches ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-xs font-bold">Evaluating multi-vector compatibility across active SOWs...</p>
                </div>
              ) : projectMatches.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed rounded-2xl">
                  No open client engagements available for matching.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectMatches.map((item) => {
                    const proj = item.project;
                    const score = item.aiMatchScore;
                    const scoreClass = score >= 90 ? "text-emerald-700 bg-emerald-50 border-emerald-300" :
                      score >= 75 ? "text-blue-700 bg-blue-50 border-blue-300" :
                      "text-amber-800 bg-amber-50 border-amber-300";

                    return (
                      <div 
                        key={proj.id}
                        className="p-4.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {proj.projectCode}
                              </span>
                              <h4 className="font-extrabold text-sm text-slate-900">{proj.name}</h4>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              Client: <strong className="text-slate-800">{proj.client}</strong> • Target Band: <strong className="text-indigo-700">{proj.targetBand || "L4+"}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-3 self-start sm:self-auto">
                            <div className={`px-3 py-1.5 rounded-xl border text-center font-black text-sm shadow-2xs ${scoreClass}`}>
                              {score}% Match
                            </div>

                            <button
                              onClick={() => {
                                onClose();
                                if (onSelectProjectForMatch) {
                                  onSelectProjectForMatch(proj.id);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
                            >
                              <span>Match in Workspace</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rationale & Coverage */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                          <p className="leading-relaxed font-medium">
                            <strong className="text-slate-900">AI Rationale: </strong>
                            {item.aiExplanation}
                          </p>
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Covered Skills:</span>
                            {(item.matchingSkills || []).map((ms) => (
                              <span key={ms.name} className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                                ✓ {ms.name} (L{ms.empProficiency})
                              </span>
                            ))}
                            {(item.missingSkills || []).map((sk) => (
                              <span key={sk} className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                ⚠ Missing: {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close Dossier
          </button>

          {isBench && (
            <button
              onClick={() => {
                setActiveTab("recommendations");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
            >
              <span>View Ranked SOW Opportunities</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
