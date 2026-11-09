import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, UserCheck, AlertCircle, SlidersHorizontal, ArrowLeftRight, Eye, Sparkles, ShieldCheck, MapPin, Award, Layers, Trophy, Clock, Compass, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import { api } from "../services/api";
import { useOrg } from "../context/OrgContext";
import { badgeStyles, getAvatarColor, getInitials } from "../utils/skillColors";
import AllocationConfirmModal from "../components/AllocationConfirmModal";

export default function AIMatching({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onAllocationProposed,
  onOpenCandidateDrawer,
  onOpenCompareModal
}) {
  const { formatMoney } = useOrg();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Allocation Confirmation Workflow Modal
  const [allocatingCandidate, setAllocatingCandidate] = useState(null);

  // Model Weight Tuner
  const [showWeightTuner, setShowWeightTuner] = useState(false);
  const [weights, setWeights] = useState({
    skillWeight: 60,
    experienceWeight: 25,
    interestWeight: 15
  });

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  useEffect(() => {
    if (currentProject) {
      fetchRecommendations(currentProject.id);
    }
  }, [currentProject?.id, weights]);

  const fetchRecommendations = async (projId) => {
    setLoading(true);
    try {
      const recs = await api.getRecommendations(projId, weights);
      setRecommendations(recs);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAllocation = async (allocationPayload) => {
    await api.proposeAllocation(allocationPayload);
    const modeText = allocationPayload.directAuthorize ? "Authorized & Assigned" : "Submitted for Manager Sign-off";
    setToastMessage(`Success: Candidate ${modeText}! Dashboards and rosters updated.`);
    if (onAllocationProposed) {
      await onAllocationProposed();
    }
    await fetchRecommendations(currentProject.id);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls Bar: AI Matching Workspace */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Matching Workspace</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-2xs">
                Multi-Vector Algorithmic Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium max-w-2xl">
              Transparent, explainable talent-to-project allocation engine evaluating 4 dimensions: technical skill mastery, seniority threshold, bench availability, and career aspirations.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            {/* Tune Matching Weights Button */}
            <button
              onClick={() => setShowWeightTuner(!showWeightTuner)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                showWeightTuner
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span>Model Weight Tuner</span>
            </button>

            {/* Compare Top 2 Candidates Button */}
            {recommendations.length >= 2 && (
              <button
                onClick={() => onOpenCompareModal(currentProject, recommendations[0], recommendations[1])}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              >
                <ArrowLeftRight className="h-4 w-4 text-slate-500" />
                <span>Compare Top 2</span>
              </button>
            )}

            {/* Target Project Dropdown */}
            <div className="relative">
              <select
                value={currentProject?.id || ""}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 text-xs font-bold focus:outline-none cursor-pointer shadow-xs hover:border-blue-400 transition-all"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} ({proj.client})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Real-time Weight Tuning Panel (Explainable AI Criteria) */}
        {showWeightTuner && (
          <div className="pt-4 border-t border-slate-100 p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/40 border border-blue-200 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-extrabold text-blue-950 text-sm block">Explainable Scoring Weights (Transparent Engine)</span>
                <span className="text-[11px] text-slate-500 font-medium">Fine-tune the mathematical weighting of the allocation algorithm</span>
              </div>
              <button
                onClick={() => setWeights({ skillWeight: 60, experienceWeight: 25, interestWeight: 15 })}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
              >
                Reset Default Weights
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                <div className="flex justify-between text-slate-700 mb-1.5">
                  <span className="font-bold">1. Technical Skill Fit</span>
                  <span className="font-extrabold text-blue-700">{weights.skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={weights.skillWeight}
                  onChange={(e) => setWeights({ ...weights, skillWeight: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                <div className="flex justify-between text-slate-700 mb-1.5">
                  <span className="font-bold">2. Seniority & Tenure Gate</span>
                  <span className="font-extrabold text-blue-700">{weights.experienceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.experienceWeight}
                  onChange={(e) => setWeights({ ...weights, experienceWeight: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                <div className="flex justify-between text-slate-700 mb-1.5">
                  <span className="font-bold">3. Career Aspiration Vector</span>
                  <span className="font-extrabold text-blue-700">{weights.interestWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={weights.interestWeight}
                  onChange={(e) => setWeights({ ...weights, interestWeight: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Project SOW Summary Bar */}
      {currentProject && (
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white text-xs flex flex-wrap items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 font-bold">
                {currentProject.projectCode}
              </span>
              <span className="text-slate-400 font-medium">Matching candidate profiles for:</span>
              <strong className="text-white text-sm font-extrabold">{currentProject.name}</strong>
            </div>
            <p className="text-slate-300 text-xs mt-1 font-medium">
              Client: <span className="text-blue-300 font-bold">{currentProject.client}</span> • {currentProject.engagementModel} • {currentProject.locationRequirement}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-slate-300 flex-wrap">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Min Tenure</span>
              <strong className="text-white font-extrabold">{currentProject.minExperienceYears} Years</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Band Target</span>
              <strong className="text-indigo-300 font-extrabold">{currentProject.targetBand || "L4+"}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Open Quota</span>
              <strong className="text-emerald-400 font-extrabold">
                {Math.max(0, currentProject.teamSize - (currentProject.allocatedCount || 0))} of {currentProject.teamSize} Open
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Billing Rate</span>
              <strong className="text-amber-300 font-extrabold">
                {formatMoney(currentProject.monthlyRevenuePerDev || 14000)} / mo
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 2.4: Semantic Badge Evaluation Legend */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-200/80 flex-wrap gap-2">
        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Evaluation Legend:</span>
        <div className="flex items-center gap-3 flex-wrap text-[11px]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-700">Satisfies Required Level (Green)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
            <span className="font-medium text-slate-700">Skill Gap / Missing (Orange)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
            <span className="font-medium text-slate-700">Verified Technical Skill (Blue)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
            <span className="font-medium text-slate-700">Industry Credential (Violet)</span>
          </span>
        </div>
      </div>

      {/* Ranked Candidate List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-block animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs text-slate-600 font-bold">Evaluating multi-vector compatibility vectors across bench engineers...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No unallocated bench engineers currently available</h3>
          <p className="text-xs text-slate-400 mt-1">All employees are currently assigned to active SOW client engagements.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item, index) => {
            const {
              employee,
              aiMatchScore,
              scoreBreakdown,
              aiExplanation,
              skillComparison,
              matchingSkills,
              missingSkills,
              experienceComparison,
              availabilityComparison,
              aspirationComparison,
              isPendingApproval
            } = item;

            const avatar = getAvatarColor(employee.name);
            const initials = getInitials(employee.name);
            const isTopRank = index === 0;

            const scoreRingClass =
              aiMatchScore >= 90
                ? "bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100 border border-emerald-300"
                : aiMatchScore >= 75
                ? "bg-blue-50 text-blue-700 ring-4 ring-blue-100 border border-blue-300"
                : "bg-amber-50 text-amber-800 ring-4 ring-amber-100 border border-amber-300";

            return (
              <div
                key={employee.id}
                className={`p-5 rounded-2xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-start justify-between gap-5 ${
                  isTopRank 
                    ? "border-blue-400 ring-2 ring-blue-100/80 bg-gradient-to-r from-blue-50/15 via-white to-white" 
                    : "border-slate-200/90 hover:border-blue-300"
                }`}
              >
                {/* Left: Comprehensive Match Breakdown (The AI Intelligence Center) */}
                <div className="space-y-3.5 flex-1 min-w-0">
                  {/* Candidate Identity Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Rank Indicator */}
                      <div className="flex flex-col items-center">
                        <span className={`flex items-center justify-center h-8 w-8 rounded-xl text-xs font-black shadow-2xs ${
                          isTopRank ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          #{index + 1}
                        </span>
                        {isTopRank && (
                          <span className="text-[10px] font-extrabold text-blue-600 mt-1 uppercase tracking-tight">
                            Top Match
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                        {initials}
                      </div>

                      {/* Name & Seniority */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                            {employee.empCode}
                          </span>
                          <h3 
                            onClick={() => onOpenCandidateDrawer(employee)}
                            className="text-base font-extrabold text-slate-900 hover:text-blue-600 cursor-pointer"
                          >
                            {employee.name}
                          </h3>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                            {employee.band}
                          </span>

                          {/* Requirement 1.4: Clear Status Labels */}
                          {isPendingApproval ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                              🟡 PENDING APPROVAL
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-300">
                              🟣 RECOMMENDED (ON BENCH)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-2 flex-wrap">
                          <span className="text-slate-800 font-bold">{employee.role}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-blue-500" />
                            <span>{(employee.location || "Global Remote").split(",")[0]}</span>
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{employee.experienceYears}y tenure</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCandidateDrawer(employee)}
                      className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 font-bold cursor-pointer shrink-0"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect Dossier</span>
                    </button>
                  </div>

                  {/* 1.2: Technical Skill Compatibility Matrix (Side-by-Side Required vs Actual) */}
                  <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                        1. Technical Competency Matrix (Required vs Candidate)
                      </span>
                      <span className="text-xs font-bold text-blue-700">
                        {matchingSkills.length} of {currentProject.requiredSkills?.length || 0} Skills Satisfied
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {(skillComparison || []).map((skill) => (
                        <div 
                          key={skill.name}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            skill.status === "EXCEEDS"
                              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                              : skill.status === "MEETS"
                              ? "bg-blue-50/80 border-blue-200 text-blue-900"
                              : "bg-amber-50/60 border-amber-200 text-amber-900"
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            {skill.status === "MISSING" ? (
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            )}
                            <strong className="truncate">{skill.name}</strong>
                          </div>

                          <div className="text-[11px] font-mono shrink-0 ml-2">
                            {skill.status === "MISSING" ? (
                              <span className="text-rose-600 font-bold">Missing (Req: L{skill.reqProficiency})</span>
                            ) : (
                              <span>Actual: <strong className="font-bold">L{skill.empProficiency}</strong> / Req: L{skill.reqProficiency}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 1.2: Dimensions Comparison (Experience, Availability, Career Interest) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    {/* Experience Dimension */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        2. Seniority Gate
                      </div>
                      <div className="flex items-baseline justify-between">
                        <strong className="text-slate-900 font-extrabold">{employee.experienceYears} Years</strong>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {experienceComparison?.delta >= 0 ? `+${experienceComparison.delta}y surplus` : `${experienceComparison.delta}y gap`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Project target: {currentProject.minExperienceYears}y min</span>
                    </div>

                    {/* Availability Dimension */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        3. Availability & Readiness
                      </div>
                      <div className="flex items-baseline justify-between">
                        <strong className="text-slate-900 font-extrabold">100% Available</strong>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          {availabilityComparison?.daysOnBench || 1}d on bench
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Ready for immediate SOW onboarding</span>
                    </div>

                    {/* Career Aspiration Dimension */}
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        4. Career Aspiration Alignment
                      </div>
                      <div className="flex items-baseline justify-between">
                        <strong className="text-indigo-900 font-extrabold truncate">
                          {aspirationComparison?.matchedInterests?.[0] || "General Growth"}
                        </strong>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 shrink-0">
                          Domain Match
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                        Domain: {currentProject.domain}
                      </span>
                    </div>
                  </div>

                  {/* 1.2: Explainable Recommendation Rationale ("WHY this score was given") */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-800 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 block">
                      AI Recommendation Rationale:
                    </span>
                    <p className="leading-relaxed font-medium">{aiExplanation}</p>
                  </div>
                </div>

                {/* Right: Score Gauge & Step 5 Action (Allocate Employee Confirmation) */}
                <div className="lg:w-56 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shrink-0 self-stretch">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">
                      Compatibility Score
                    </span>
                    <div className={`px-4 py-2 rounded-2xl ${scoreRingClass} shadow-xs`}>
                      <span className="text-3xl font-black">{aiMatchScore}%</span>
                    </div>
                  </div>

                  <div className="mt-2.5 text-center">
                    <span className="text-xs font-bold text-slate-700 block">
                      {aiMatchScore >= 90 ? "★ Optimal Fit" : aiMatchScore >= 75 ? "Strong Candidate" : "Viable Match"}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Tech: {scoreBreakdown?.technicalFit}/60 • Exp: {scoreBreakdown?.experienceFit}/25
                    </span>
                  </div>

                  {/* Step 5: Allocate Employee Trigger -> Opens Allocation Confirmation Dialog */}
                  <div className="w-full mt-4">
                    {isPendingApproval ? (
                      <button
                        onClick={() => setAllocatingCandidate(item)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-amber-300"
                        title="Click to review or authorize"
                      >
                        <Clock className="h-4 w-4 text-amber-700" />
                        <span>Pending Sign-off</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setAllocatingCandidate(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200 flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="h-4 w-4" />
                        <span>Allocate Employee</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Requirement 1.3: Step 6 Allocation Confirmation Workflow Dialog */}
      <AllocationConfirmModal
        isOpen={Boolean(allocatingCandidate)}
        onClose={() => setAllocatingCandidate(null)}
        candidate={allocatingCandidate}
        project={currentProject}
        onConfirmAllocation={handleConfirmAllocation}
      />
    </div>
  );
}
