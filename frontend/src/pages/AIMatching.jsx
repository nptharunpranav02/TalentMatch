import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, UserCheck, AlertCircle, SlidersHorizontal, ArrowLeftRight, Eye, Sparkles, ShieldCheck, MapPin, Award, Layers, Trophy } from "lucide-react";
import { api } from "../services/api";
import { useOrg } from "../context/OrgContext";
import { getSkillBadgeClass, getAvatarColor, getInitials } from "../utils/skillColors";

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
  const [proposedMap, setProposedMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

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

  const handlePropose = async (candidate) => {
    try {
      await api.proposeAllocation({
        employeeId: candidate.employee.id,
        projectId: currentProject.id,
        aiMatchScore: candidate.aiMatchScore,
        scoreBreakdown: candidate.scoreBreakdown,
        aiExplanation: candidate.aiExplanation
      });

      setProposedMap((prev) => ({ ...prev, [candidate.employee.id]: true }));
      setToastMessage(`Proposed ${candidate.employee.name} (${candidate.employee.empCode}) for ${currentProject.name}. Sent for Manager Sign-off.`);

      if (onAllocationProposed) {
        onAllocationProposed();
      }

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Propose failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Multi-Factor Candidate Matcher</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                Explainable Vector Engine
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Multi-dimensional evaluation: technical competence, seniority threshold, and domain aspiration alignment.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
            {/* Weight Tuner Toggle */}
            <button
              onClick={() => setShowWeightTuner(!showWeightTuner)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                showWeightTuner
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 text-blue-600" />
              <span>Tune Matching Weights</span>
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

        {/* Real-time Weight Tuning Panel */}
        {showWeightTuner && (
          <div className="pt-4 border-t border-slate-100 p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-blue-950 text-sm">Decomposed Multi-Factor Weights (Explainable AI Engine)</span>
              <button
                onClick={() => setWeights({ skillWeight: 60, experienceWeight: 25, interestWeight: 15 })}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
              >
                Reset Default Model Weights
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                <div className="flex justify-between text-slate-700 mb-1.5">
                  <span className="font-bold">Technical Competency Fit</span>
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
                  <span className="font-bold">Seniority & Experience Gate</span>
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
                  <span className="font-bold">Aspiration & Growth Vector</span>
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
              <span className="text-slate-400 font-medium">Matching talent for:</span>
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
                {Math.max(0, currentProject.teamSize - (currentProject.allocatedCount || 0))} Engineers
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

      {/* Ranked Candidate List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-block animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-xs text-slate-600 font-bold">Calculating multi-factor candidate compatibility...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No bench candidates currently available</h3>
          <p className="text-xs text-slate-400 mt-1">All qualified engineers are currently allocated.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item, index) => {
            const { employee, aiMatchScore, scoreBreakdown, aiExplanation, matchingSkills, missingSkills } = item;
            const isProposed = proposedMap[employee.id];
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
                className={`p-5 rounded-2xl bg-white border transition-all shadow-sm hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  isTopRank 
                    ? "border-blue-400 ring-2 ring-blue-100/80 bg-gradient-to-r from-blue-50/20 via-white to-white" 
                    : "border-slate-200/90 hover:border-blue-300"
                }`}
              >
                {/* Left: Candidate Info & Transparent Breakdown */}
                <div className="space-y-3.5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Rank Badge */}
                      <div className="flex flex-col items-center">
                        <span className={`flex items-center justify-center h-8 w-8 rounded-xl text-xs font-black shadow-2xs ${
                          isTopRank ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}>
                          #{index + 1}
                        </span>
                        {isTopRank && (
                          <span className="text-[10px] font-extrabold text-blue-600 mt-1 uppercase tracking-tight">
                            Top Pick
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                        {initials}
                      </div>

                      {/* Details */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
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

                  {/* Decomposed Score Metrics (Explainable AI - MAANG Evaluators Standard) */}
                  {scoreBreakdown && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-slate-50/90 p-3 rounded-xl border border-slate-200/80">
                      <div>
                        <div className="flex justify-between text-slate-600 text-[11px] font-medium mb-1">
                          <span>Technical Fit</span>
                          <strong className="text-slate-900 font-extrabold">{scoreBreakdown.technicalFit} / {weights.skillWeight} pts</strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (scoreBreakdown.technicalFit / weights.skillWeight) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 text-[11px] font-medium mb-1">
                          <span>Seniority & Tenure Gate</span>
                          <strong className="text-slate-900 font-extrabold">{scoreBreakdown.experienceFit} / {weights.experienceWeight} pts</strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (scoreBreakdown.experienceFit / weights.experienceWeight) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-600 text-[11px] font-medium mb-1">
                          <span>Aspiration Alignment</span>
                          <strong className="text-slate-900 font-extrabold">{scoreBreakdown.aspirationFit} / {weights.interestWeight} pts</strong>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full" 
                            style={{ width: `${Math.min(100, (scoreBreakdown.aspirationFit / weights.interestWeight) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Explainability Rationale */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-800">
                    <p className="leading-relaxed font-medium">{aiExplanation}</p>
                  </div>

                  {/* Skills Match Breakdown */}
                  <div className="flex flex-wrap gap-1.5 items-center text-xs">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mr-1">Skills:</span>
                    {matchingSkills.map((s) => (
                      <span
                        key={s.name}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
                      >
                        <Check className="h-3 w-3 text-emerald-700" />
                        <span>{s.name}</span>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          (L{s.empProficiency}/L{s.reqProficiency})
                        </span>
                      </span>
                    ))}
                    {(missingSkills || []).map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200"
                      >
                        {m} (trainable)
                      </span>
                    ))}
                    {employee.certifications && employee.certifications.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 inline-flex items-center gap-1 ml-auto shadow-2xs">
                        <ShieldCheck className="h-3 w-3 text-blue-600" />
                        <span>{employee.certifications[0]}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Score Gauge & Propose Button */}
                <div className="lg:w-56 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block mb-1">
                      Compatibility Match
                    </span>
                    <div className={`px-4 py-2 rounded-2xl ${scoreRingClass} shadow-xs`}>
                      <span className="text-3xl font-black">{aiMatchScore}%</span>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <span className="text-xs font-bold text-slate-700">
                      {aiMatchScore >= 90 ? "★ Optimal Placement" : aiMatchScore >= 75 ? "Strong Candidate" : "Viable Match"}
                    </span>
                  </div>

                  <div className="w-full mt-4">
                    {isProposed ? (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 border border-emerald-300"
                      >
                        <Check className="h-4 w-4 text-emerald-700" />
                        Pending Sign-off
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePropose(item)}
                        className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200 flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="h-4 w-4" />
                        Propose Candidate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
