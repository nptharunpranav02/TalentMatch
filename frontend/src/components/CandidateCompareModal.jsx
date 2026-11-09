import React from "react";
import { X, Check, CheckCircle2, Award, Clock } from "lucide-react";

export default function CandidateCompareModal({
  isOpen,
  onClose,
  project,
  candidateA,
  candidateB,
  onSelectCandidate
}) {
  if (!isOpen || !project || !candidateA || !candidateB) return null;

  const empA = candidateA.employee;
  const empB = candidateB.employee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Head-to-Head Candidate Comparison</h2>
            <p className="text-xs text-slate-500">Evaluating candidates for {project.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 divide-x divide-slate-100">
            {/* Candidate A */}
            <div className="space-y-4 pr-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{empA.name}</h3>
                  <p className="text-xs text-slate-500">{empA.role}</p>
                </div>
                <span className="text-xl font-bold text-slate-900">{candidateA.aiMatchScore}%</span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 text-xs text-slate-700">
                <span className="font-medium block text-slate-900 mb-0.5">Match Assessment</span>
                <p className="text-[11px] leading-relaxed text-slate-600">{candidateA.aiExplanation}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-medium text-slate-400 block">Experience</span>
                <p className="font-medium text-slate-800">{empA.experienceYears} Years (Req: {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateA.matchingSkills.map((s) => (
                    <span key={s.name} className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCandidate(candidateA);
                  onClose();
                }}
                className="w-full mt-4 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
              >
                Select {empA.name.split(" ")[0]}
              </button>
            </div>

            {/* Candidate B */}
            <div className="space-y-4 pl-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">{empB.name}</h3>
                  <p className="text-xs text-slate-500">{empB.role}</p>
                </div>
                <span className="text-xl font-bold text-slate-900">{candidateB.aiMatchScore}%</span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 text-xs text-slate-700">
                <span className="font-medium block text-slate-900 mb-0.5">Match Assessment</span>
                <p className="text-[11px] leading-relaxed text-slate-600">{candidateB.aiExplanation}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-medium text-slate-400 block">Experience</span>
                <p className="font-medium text-slate-800">{empB.experienceYears} Years (Req: {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateB.matchingSkills.map((s) => (
                    <span key={s.name} className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                      ✓ {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCandidate(candidateB);
                  onClose();
                }}
                className="w-full mt-4 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
              >
                Select {empB.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
