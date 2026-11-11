import React from "react";
import { X, Check, CheckCircle2, Award, Clock, ShieldCheck, MapPin } from "lucide-react";
import { getSkillBadgeClass, getAvatarColor, getInitials } from "../utils/skillColors";

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
  const avatarA = getAvatarColor(empA.name);
  const avatarB = getAvatarColor(empB.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Head-to-Head Candidate Assessment</h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold border border-blue-200">
                {project.projectCode}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Evaluating optimal talent placement for {project.name} ({project.client})</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* Candidate A */}
            <div className="space-y-4 md:pr-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${avatarA.bg} ${avatarA.text} ${avatarA.border} border shadow-2xs shrink-0`}>
                    {getInitials(empA.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {empA.empCode}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{empA.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{empA.band} • {empA.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-700">{candidateA.aiMatchScore}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold">MATCH SCORE</span>
                </div>
              </div>

              {/* Decomposed Score */}
              {candidateA.scoreBreakdown && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Scoring Decomposition</span>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Technical Coverage:</span>
                    <strong className="text-blue-700 font-bold">{candidateA.scoreBreakdown.technicalFit} pts</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Seniority Gate:</span>
                    <strong className="text-emerald-700 font-bold">{candidateA.scoreBreakdown.experienceFit} pts</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Aspiration Alignment:</span>
                    <strong className="text-indigo-700 font-bold">{candidateA.scoreBreakdown.aspirationFit} pts</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Verified Experience</span>
                <p className="font-bold text-slate-900">{empA.experienceYears} Years (SOW asks for {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateA.matchingSkills.map((s) => (
                    <span key={s.name} className="px-2 py-0.5 rounded-md text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                      ✓ {s.name} (L{s.empProficiency})
                    </span>
                  ))}
                </div>
              </div>

              {empA.certifications && empA.certifications.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Credentials</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    <span>{empA.certifications[0]}</span>
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  onSelectCandidate(candidateA);
                  onClose();
                }}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
              >
                Select & Propose {(empA?.name || "Candidate").split(" ")[0]}
              </button>
            </div>

            {/* Candidate B */}
            <div className="space-y-4 pt-6 md:pt-0 md:pl-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-extrabold text-sm ${avatarB.bg} ${avatarB.text} ${avatarB.border} border shadow-2xs shrink-0`}>
                    {getInitials(empB.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {empB.empCode}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{empB.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{empB.band} • {empB.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-700">{candidateB.aiMatchScore}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold">MATCH SCORE</span>
                </div>
              </div>

              {/* Decomposed Score */}
              {candidateB.scoreBreakdown && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Scoring Decomposition</span>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Technical Coverage:</span>
                    <strong className="text-blue-700 font-bold">{candidateB.scoreBreakdown.technicalFit} pts</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Seniority Gate:</span>
                    <strong className="text-emerald-700 font-bold">{candidateB.scoreBreakdown.experienceFit} pts</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Aspiration Alignment:</span>
                    <strong className="text-indigo-700 font-bold">{candidateB.scoreBreakdown.aspirationFit} pts</strong>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Verified Experience</span>
                <p className="font-bold text-slate-900">{empB.experienceYears} Years (SOW asks for {project.minExperienceYears}y)</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block text-xs">Skills Matched</span>
                <div className="flex flex-wrap gap-1">
                  {candidateB.matchingSkills.map((s) => (
                    <span key={s.name} className="px-2 py-0.5 rounded-md text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold">
                      ✓ {s.name} (L{s.empProficiency})
                    </span>
                  ))}
                </div>
              </div>

              {empB.certifications && empB.certifications.length > 0 && (
                <div className="space-y-1 text-xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Credentials</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                    <span>{empB.certifications[0]}</span>
                  </span>
                </div>
              )}

              <button
                onClick={() => {
                  onSelectCandidate(candidateB);
                  onClose();
                }}
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
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
