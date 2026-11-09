import React from "react";
import { X, Mail, Award, Clock, DollarSign, ArrowRight, Compass, CheckCircle2 } from "lucide-react";
import { getSkillBadgeClass } from "../utils/skillColors";

export default function CandidateDrawer({ employee, isOpen, onClose, onMatchProject }) {
  if (!isOpen || !employee) return null;

  const isBench = employee.availabilityStatus === "BENCH";

  const calculateBenchDays = (dateStr) => {
    if (!dateStr) return 0;
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const benchDays = isBench ? calculateBenchDays(employee.benchSince) : 0;
  const estimatedDailyCost = 150;
  const totalIdleCost = benchDays * estimatedDailyCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{employee.name}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    isBench
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  {isBench ? "On Bench" : "Allocated"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{employee.role} • {employee.department}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Financial & Bench Metrics Card with Natural Amber / Rose Tones */}
            {isBench && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                  Bench Cost & Idle Overhead Impact
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Current Bench Time</span>
                    <strong className="text-base font-bold text-amber-900">{benchDays} Days</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estimated Idle Cost</span>
                    <strong className="text-base font-bold text-rose-700">${totalIdleCost.toLocaleString()}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-amber-950/80 border-t border-amber-200/60 pt-2">
                  Immediate project deployment eliminates this overhead and converts it into active billable project revenue.
                </p>
              </div>
            )}

            {/* Experience & Contact */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Profile Details
              </span>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Corporate Email</span>
                <span className="font-medium text-slate-900">{employee.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Experience</span>
                <span className="font-semibold text-slate-900">{employee.experienceYears} Years</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Department</span>
                <span className="font-medium text-slate-900">{employee.department}</span>
              </div>
            </div>

            {/* Technical Skills Competency Breakdown with Natural Colored Badges & Bars */}
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Technical Proficiencies
              </span>
              <div className="space-y-2.5">
                {(employee.skills || []).map((skill) => {
                  const percent = (skill.proficiency / 5) * 100;
                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-1.5 py-0.2 rounded text-[11px] font-medium border ${getSkillBadgeClass(skill.name)}`}>
                          {skill.name}
                        </span>
                        <span className="text-slate-500 text-[11px] font-medium">{skill.years || 2} yrs exp</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-800 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Career Interests */}
            {employee.careerInterests && employee.careerInterests.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Career Aspirations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.careerInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          {isBench && (
            <button
              onClick={() => {
                onClose();
                if (onMatchProject) onMatchProject(employee);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <span>Match with Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
