import React from "react";
import { X, Mail, Award, Clock, ArrowRight, Compass, CheckCircle2, ShieldCheck, MapPin, Briefcase } from "lucide-react";
import { getSkillBadgeClass, getAvatarColor, getInitials } from "../utils/skillColors";
import { useOrg } from "../context/OrgContext";

export default function CandidateDrawer({ employee, isOpen, onClose, onMatchProject }) {
  const { formatMoney } = useOrg();
  if (!isOpen || !employee) return null;

  const isBench = employee.availabilityStatus === "BENCH";

  const calculateBenchDays = (dateStr) => {
    if (!dateStr) return 0;
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };

  const benchDays = isBench ? calculateBenchDays(employee.benchSince) : 0;
  const baseDailyCostUSD = 160; 
  const totalIdleCostUSD = benchDays * baseDailyCostUSD;
  const monthlyBillableRunRateUSD = 15000;
  const avatar = getAvatarColor(employee.name);
  const initials = getInitials(employee.name);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Avatar & Details */}
        <div>
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
            <div className="flex items-start gap-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-base ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 font-bold">
                    {employee.empCode || "TM-EMP"}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900">{employee.name}</h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${
                      isBench
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300"
                    }`}
                  >
                    {isBench ? "On Bench" : "Allocated"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{employee.role}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Enterprise ROI & Bench Mitigation Card */}
            {isBench && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60 border border-amber-300 shadow-sm space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 block">
                  Workforce Utilization & Cost Burn
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 shadow-2xs">
                    <span className="text-slate-500 font-medium block">Bench Time</span>
                    <strong className="text-lg font-extrabold text-amber-950">{benchDays} Days</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-rose-200/80 shadow-2xs">
                    <span className="text-slate-500 font-medium block">Accrued Cost</span>
                    <strong className="text-lg font-extrabold text-rose-600">{formatMoney(totalIdleCostUSD)}</strong>
                  </div>
                </div>
                <div className="border-t border-amber-200/80 pt-2 text-xs flex items-center justify-between text-slate-700">
                  <span className="font-medium">Revenue Recovery Potential:</span>
                  <strong className="text-blue-700 font-extrabold">{formatMoney(monthlyBillableRunRateUSD)} / mo</strong>
                </div>
              </div>
            )}

            {/* Profile Credentials */}
            <div className="space-y-2 text-xs bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                Enterprise Credentials
              </span>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Corporate Email</span>
                <span className="font-bold text-slate-900">{employee.email}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Base Office</span>
                <span className="font-bold text-slate-900">{employee.location || "Global Remote"}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Seniority Band</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">{employee.band || "L4 / Senior SDE"}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 font-medium">Verified Tenure</span>
                <span className="font-bold text-slate-900">{employee.experienceYears} Years</span>
              </div>
            </div>

            {/* Certifications */}
            {employee.certifications && employee.certifications.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Industry Certifications
                </span>
                <div className="space-y-1.5">
                  {employee.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="p-2.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-2 shadow-2xs"
                    >
                      <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills Competency Breakdown with Vibrant Progress Bars */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Technical Proficiencies (Verified)
              </span>
              <div className="space-y-3">
                {(employee.skills || []).map((skill) => {
                  const percent = (skill.proficiency / 5) * 100;
                  return (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getSkillBadgeClass(skill.name)}`}>
                          {skill.name}
                        </span>
                        <span className="text-slate-600 text-xs font-bold">L{skill.proficiency} / L5 • {skill.years || 2}y exp</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Project Contributions */}
            {employee.previousProjects && employee.previousProjects.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Past Project Portfolio
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.previousProjects.map((p) => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Career Aspirations */}
            {employee.careerInterests && employee.careerInterests.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Career Growth Aspirations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.careerInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300"
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          {isBench && (
            <button
              onClick={() => {
                onClose();
                if (onMatchProject) onMatchProject(employee);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-blue-200"
            >
              <span>Match with Active SOWs</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
