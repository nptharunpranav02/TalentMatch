import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, UserCheck, AlertCircle, SlidersHorizontal, ArrowLeftRight, Eye, Sparkles } from "lucide-react";
import { api } from "../services/api";

export default function AIMatching({
  projects,
  selectedProjectId,
  setSelectedProjectId,
  onAllocationProposed,
  onOpenCandidateDrawer,
  onOpenCompareModal
}) {
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
      const baseRecs = await api.getRecommendations(projId);
      const totalWeight = weights.skillWeight + weights.experienceWeight + weights.interestWeight;
      const normalized = baseRecs.map((item) => {
        const emp = item.employee;
        const reqSkills = currentProject.requiredSkills || [];
        const empSkills = emp.skills || [];

        let skillPoints = 0;
        reqSkills.forEach((req) => {
          const found = empSkills.find(
            (s) => s.name.toLowerCase() === req.name.toLowerCase()
          );
          if (found) {
            skillPoints += Math.min(found.proficiency / (req.minProficiency || 1), 1.0);
          }
        });

        const skillScore = reqSkills.length > 0 ? (skillPoints / reqSkills.length) * weights.skillWeight : 0;
        const expScore = Math.min(((emp.experienceYears || 0) / (currentProject.minExperienceYears || 1)) * weights.experienceWeight, weights.experienceWeight);

        let interestScore = 0;
        const projectText = `${currentProject.name} ${currentProject.description}`.toLowerCase();
        (emp.careerInterests || []).forEach((interest) => {
          if (projectText.includes(interest.toLowerCase().split(" ")[0])) {
            interestScore += weights.interestWeight / 2;
          }
        });
        interestScore = Math.min(interestScore, weights.interestWeight);

        const calculated = Math.round(Math.min(((skillScore + expScore + interestScore) / totalWeight) * 100, 100));

        return {
          ...item,
          aiMatchScore: calculated
        };
      });

      setRecommendations(normalized.sort((a, b) => b.aiMatchScore - a.aiMatchScore));
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
        aiExplanation: candidate.aiExplanation
      });

      setProposedMap((prev) => ({ ...prev, [candidate.employee.id]: true }));
      setToastMessage(`Proposed ${candidate.employee.name} for ${currentProject.name}. Sent to Approvals.`);

      if (onAllocationProposed) {
        onAllocationProposed();
      }

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Propose failed", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Candidate Matching</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Rank bench talent against project requirements, experience, and domain interests.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Weight Tuner Toggle with Organic Teal/Blue Accent */}
            <button
              onClick={() => setShowWeightTuner(!showWeightTuner)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                showWeightTuner
                  ? "bg-blue-900 text-white border border-blue-900 shadow-xs"
                  : "bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600" />
              <span>Tune Match Weights</span>
            </button>

            {/* Compare Top 2 Candidates Button */}
            {recommendations.length >= 2 && (
              <button
                onClick={() => onOpenCompareModal(currentProject, recommendations[0], recommendations[1])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="h-3.5 w-3.5 text-slate-500" />
                <span>Compare Top 2</span>
              </button>
            )}

            {/* Target Project Dropdown */}
            <select
              value={currentProject?.id || ""}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-blue-400"
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
          <div className="pt-3 border-t border-slate-100 p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-blue-950">Interactive Matching Weights</span>
              <button
                onClick={() => setWeights({ skillWeight: 60, experienceWeight: 25, interestWeight: 15 })}
                className="text-[11px] text-blue-700 hover:text-blue-900 underline"
              >
                Reset to Default
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Skill Coverage</span>
                  <span className="font-bold text-blue-900">{weights.skillWeight}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={weights.skillWeight}
                  onChange={(e) => setWeights({ ...weights, skillWeight: Number(e.target.value) })}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Experience Threshold</span>
                  <span className="font-bold text-blue-900">{weights.experienceWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={weights.experienceWeight}
                  onChange={(e) => setWeights({ ...weights, experienceWeight: Number(e.target.value) })}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Career Alignment</span>
                  <span className="font-bold text-blue-900">{weights.interestWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={weights.interestWeight}
                  onChange={(e) => setWeights({ ...weights, interestWeight: Number(e.target.value) })}
                  className="w-full accent-blue-700 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Project Summary Bar */}
      {currentProject && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <span className="text-slate-400 font-medium">Evaluating bench talent for: </span>
            <strong className="text-white text-sm ml-1">{currentProject.name}</strong>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span>Min Exp: <strong className="text-white">{currentProject.minExperienceYears} yrs</strong></span>
            <span>•</span>
            <span>Unfilled: <strong className="text-emerald-400 font-bold">{Math.max(0, currentProject.teamSize - (currentProject.allocatedCount || 0))} seats</strong></span>
            <span>•</span>
            <span>Stack: <strong className="text-sky-300">{(currentProject.requiredSkills || []).map((s) => s.name).join(", ")}</strong></span>
          </div>
        </div>
      )}

      {/* Ranked Candidate List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Calculating candidate compatibility...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-xs font-medium text-slate-700">No bench candidates currently available</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">All engineers are currently allocated.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((item, index) => {
            const { employee, aiMatchScore, aiExplanation, matchingSkills, missingSkills } = item;
            const isProposed = proposedMap[employee.id];

            // Natural organic score badge styling
            const scoreClass =
              aiMatchScore >= 90
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : aiMatchScore >= 75
                ? "bg-blue-50 text-blue-800 border-blue-300"
                : "bg-amber-50 text-amber-800 border-amber-300";

            return (
              <div
                key={employee.id}
                className={`p-5 rounded-xl bg-white border transition-all shadow-2xs hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  index === 0 ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200/90 hover:border-slate-300"
                }`}
              >
                {/* Left: Candidate & Breakdown */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center justify-center h-6 w-6 rounded text-xs font-bold ${
                        index === 0 ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-700"
                      }`}>
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => onOpenCandidateDrawer(employee)}
                            className="text-sm font-semibold text-slate-900 hover:text-blue-700 cursor-pointer"
                          >
                            {employee.name}
                          </h3>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{employee.role}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {employee.experienceYears} yrs experience • {employee.department}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenCandidateDrawer(employee)}
                      className="text-xs text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect Profile</span>
                    </button>
                  </div>

                  {/* Factual explanation */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <p className="leading-relaxed">{aiExplanation}</p>
                  </div>

                  {/* Skills match breakdown */}
                  <div className="flex flex-wrap gap-1.5 items-center text-xs">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">Skills:</span>
                    {matchingSkills.map((s) => (
                      <span
                        key={s.name}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>{s.name}</span>
                      </span>
                    ))}
                    {(missingSkills || []).map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded text-xs text-slate-400 bg-slate-50 border border-slate-200"
                      >
                        {m} (missing)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Score Gauge & Propose Button */}
                <div className="md:w-48 flex flex-col items-center justify-center p-3.5 rounded-lg bg-slate-50/80 border border-slate-100 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Compatibility
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{aiMatchScore}%</span>
                  </div>

                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${scoreClass}`}>
                      {aiMatchScore >= 90 ? "Excellent Fit" : aiMatchScore >= 75 ? "Strong Candidate" : "Viable Match"}
                    </span>
                  </div>

                  <div className="w-full mt-3">
                    {isProposed ? (
                      <button
                        disabled
                        className="w-full py-1.5 px-3 rounded-md bg-emerald-100 text-emerald-900 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5 text-emerald-700" />
                        Proposed
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePropose(item)}
                        className="w-full py-1.5 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                      >
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
