import React, { useState, useEffect } from "react";
import { Check, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export default function AIMatching({ projects, selectedProjectId, setSelectedProjectId, onAllocationProposed }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proposedMap, setProposedMap] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  useEffect(() => {
    if (currentProject) {
      fetchRecommendations(currentProject.id);
    }
  }, [currentProject?.id]);

  const fetchRecommendations = async (projId) => {
    setLoading(true);
    try {
      const recs = await api.getRecommendations(projId);
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
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Target Project Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Candidate Matching</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rank bench talent against project requirements, experience, and domain interests.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Select Target Project</label>
          <select
            value={currentProject?.id || ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:border-slate-400"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.client})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Project Requirements Summary */}
      {currentProject && (
        <div className="p-3.5 rounded-lg bg-slate-100/80 border border-slate-200/80 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-slate-400 font-medium">Evaluating requirements for: </span>
            <strong className="text-slate-900">{currentProject.name}</strong>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Min Exp: <strong className="text-slate-900">{currentProject.minExperienceYears} yrs</strong></span>
            <span>•</span>
            <span>Unfilled: <strong className="text-slate-900">{Math.max(0, currentProject.teamSize - (currentProject.allocatedCount || 0))} seats</strong></span>
            <span>•</span>
            <span>Stack: <strong className="text-slate-900">{(currentProject.requiredSkills || []).map((s) => s.name).join(", ")}</strong></span>
          </div>
        </div>
      )}

      {/* Ranked Candidate List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Calculating candidate compatibility...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <h3 className="text-xs font-medium text-slate-700">No bench candidates currently available</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">All engineers are currently allocated.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((item, index) => {
            const { employee, aiMatchScore, aiExplanation, matchingSkills, missingSkills } = item;
            const isProposed = proposedMap[employee.id];

            return (
              <div
                key={employee.id}
                className="p-5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Candidate & Breakdown */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{employee.name}</h3>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{employee.role}</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {employee.experienceYears} yrs experience • {employee.department}
                      </p>
                    </div>
                  </div>

                  {/* Factual explanation */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-700">
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

                {/* Right: Score & Propose Button */}
                <div className="md:w-48 flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50/80 border border-slate-100 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Compatibility
                    </span>
                    <span className="text-2xl font-bold text-slate-900">{aiMatchScore}%</span>
                  </div>

                  <div className="w-full mt-3">
                    {isProposed ? (
                      <button
                        disabled
                        className="w-full py-1.5 px-3 rounded-md bg-slate-200 text-slate-600 text-xs font-medium cursor-not-allowed"
                      >
                        Proposed
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePropose(item)}
                        className="w-full py-1.5 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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
