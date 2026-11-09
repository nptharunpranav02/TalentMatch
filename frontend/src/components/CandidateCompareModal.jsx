import React from "react";
import { X, Check, CheckCircle2, Award, Clock, ShieldCheck, MapPin } from "lucide-react";
import { getSkillBadgeClass } from "../utils/skillColors";

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
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Head-to-Head Candidate Assessment</h2>
              <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                {project.projectCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Evaluating optimal talent placement for {project.name} ({project.client})</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8 divide-x divide-slate-100">
            {/* Candidate A */}
            <div className="space-y-4 pr-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                      {empA.empCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{empA.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{empA.band} • {empA.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{candidateA.aiMatchScore}%</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">MATCH SCORE</span>
                </div>
              </div>

              {/* Decomposed Score */}
              {candidateA.scoreBreakdown && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Scoring Decomposition</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Technical Coverage:</span>
                    <strong className="text-slate-900">{candidateA.scoreBreakdown.technicalFit}/60</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Seniority & Gate:</span>
                    <strong className="text-slate-900">{candidateA.scoreBreakdown.experienceFit}/25</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Aspiration Alignment:</span>
                    <strong className="text-slate-900">{candidateA.scoreBreakdown.aspirationFit}/15</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Verified Experience</span>
                <p className="font-semibold text-slate-900">{empA.experienceYears} Years (SOW asks for {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateA.matchingSkills.map((s) => (
                    <span key={s.name} className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      ✓ {s.name} (L{s.empProficiency})
                    </span>
                  ))}
                </div>
              </div>

              {empA.certifications && empA.certifications.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Credentials</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                    <ShieldCheck className="h-3 w-3 text-blue-600" />
                    <span>{empA.certifications[0]}</span>
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  onSelectCandidate(candidateA);
                  onClose();
                }}
                className="w-full mt-4 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Select & Propose {(empA?.name || "Candidate").split(" ")[0]}
              </button>
            </div>

            {/* Candidate B */}
            <div className="space-y-4 pl-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                      {empB.empCode}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{empB.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{empB.band} • {empB.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{candidateB.aiMatchScore}%</span>
                  <span className="text-[10px] text-slate-400 block font-semibold">MATCH SCORE</span>
                </div>
              </div>

              {/* Decomposed Score */}
              {candidateB.scoreBreakdown && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Scoring Decomposition</span>
                  <div className="flex justify-between text-slate-600">
                    <span>Technical Coverage:</span>
                    <strong className="text-slate-900">{candidateB.scoreBreakdown.technicalFit}/60</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Seniority & Gate:</span>
                    <strong className="text-slate-900">{candidateB.scoreBreakdown.experienceFit}/25</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Aspiration Alignment:</span>
                    <strong className="text-slate-900">{candidateB.scoreBreakdown.aspirationFit}/15</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Verified Experience</span>
                <p className="font-semibold text-slate-900">{empB.experienceYears} Years (SOW asks for {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateB.matchingSkills.map((s) => (
                    <span key={s.name} className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      ✓ {s.name} (L{s.empProficiency})
                    </span>
                  ))}
                </div>
              </div>

              {empB.certifications && empB.certifications.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Credentials</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                    <ShieldCheck className="h-3 w-3 text-blue-600" />
                    <span>{empB.certifications[0]}</span>
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  onSelectCandidate(candidateB);
                  onClose();
                }}
                className="w-full mt-4 py-2 px-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Select & Propose {(empB?.name || "Candidate").split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
