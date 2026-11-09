import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, UserCheck, Briefcase, Award, Zap, Compass, Check } from "lucide-react";
import { api } from "../services/api";

export default function AIMatching({ projects, selectedProjectId, setSelectedProjectId, onAllocationProposed }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proposedMap, setProposedMap] = useState({}); // track proposed status per employeeId
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
      console.error("Failed to fetch AI recommendations", err);
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
      setToastMessage(`Proposed ${candidate.employee.name} for ${currentProject.name}! Sent to Manager Approval queue.`);

      if (onAllocationProposed) {
        onAllocationProposed();
      }

      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Propose failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Recommendation & Matching Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Intelligent Candidate Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Select a project to evaluate bench employees using skills similarity, experience depth, and career interest alignment.
          </p>
        </div>

        {/* Project Dropdown Selector */}
        <div className="w-full md:w-80">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Target Project
          </label>
          <select
            value={currentProject?.id || ""}
            onChange={(e) => {
              setSelectedProjectId(e.target.value);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-sm font-semibold text-slate-800 bg-indigo-50/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name} ({proj.client})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Project Info Summary Bar */}
      {currentProject && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase text-indigo-300">Evaluating for</span>
            <h2 className="text-base font-bold">{currentProject.name}</h2>
            <p className="text-xs text-slate-300">{currentProject.description}</p>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Min Experience</span>
              <span className="font-bold text-white">{currentProject.minExperienceYears} Years</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Seats Open</span>
              <span className="font-bold text-emerald-400">
                {Math.max(0, currentProject.teamSize - (currentProject.allocatedCount || 0))} slots
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Required Stack</span>
              <span className="font-bold text-indigo-200">
                {(currentProject.requiredSkills || []).map((s) => s.name).join(", ")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation List */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <Sparkles className="h-8 w-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Evaluating candidate vectors & calculating match scores...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No bench candidates available</h3>
          <p className="text-xs text-slate-500 mt-1">All employees are currently assigned to active projects.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Ranked by AI Compatibility Score ({recommendations.length} Bench Candidates)</span>
            <span>Sorted High to Low</span>
          </div>

          {recommendations.map((item, index) => {
            const { employee, aiMatchScore, aiExplanation, matchingSkills } = item;
            const isProposed = proposedMap[employee.id];

            const scoreColor =
              aiMatchScore >= 80
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : aiMatchScore >= 60
                ? "text-indigo-700 bg-indigo-50 border-indigo-200"
                : "text-amber-700 bg-amber-50 border-amber-200";

            return (
              <div
                key={employee.id}
                className={`p-6 rounded-2xl bg-white border transition-all ${
                  index === 0
                    ? "border-indigo-300 shadow-md ring-1 ring-indigo-200"
                    : "border-slate-200 shadow-xs hover:shadow-md"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Candidate Info & AI Explanation */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-7 w-7 rounded-full bg-slate-900 text-white text-xs font-bold">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{employee.name}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {employee.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {employee.experienceYears} Years Total Exp • Department: {employee.department}
                        </p>
                      </div>
                    </div>

                    {/* AI Explanation Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                      <Zap className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                          AI Compatibility Rationale
                        </span>
                        <p className="leading-relaxed">{aiExplanation}</p>
                      </div>
                    </div>

                    {/* Matching Skills vs Project Required Skills */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Matched Skill Analysis
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingSkills.map((s) => (
                          <span
                            key={s.name}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>{s.name}</span>
                            <span className="text-[10px] text-emerald-600 font-mono">
                              (L{s.empProficiency}/Min L{s.reqProficiency})
                            </span>
                          </span>
                        ))}
                        {(currentProject.requiredSkills || []).map((req) => {
                          const matched = matchingSkills.some(
                            (m) => m.name.toLowerCase() === req.name.toLowerCase()
                          );
                          if (matched) return null;
                          return (
                            <span
                              key={req.name}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-400 border border-slate-200"
                            >
                              <span>{req.name} (Missing)</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Career Alignment */}
                    {employee.careerInterests && employee.careerInterests.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Compass className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="font-medium">Career Interests:</span>
                        <span className="text-slate-500">
                          {employee.careerInterests.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Score Gauge & Propose Button */}
                  <div className="lg:w-56 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Match Compatibility
                    </span>
                    <div className="my-2 flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900">{aiMatchScore}</span>
                      <span className="text-sm font-bold text-slate-500">%</span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                      {aiMatchScore >= 80 ? "Top Recommendation" : aiMatchScore >= 60 ? "Viable Candidate" : "Moderate Match"}
                    </div>

                    <div className="w-full mt-4">
                      {isProposed ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Check className="h-4 w-4" />
                          Proposed to Manager
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePropose(item)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="h-4 w-4" />
                          Propose Allocation
                        </button>
                      )}
                    </div>
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
