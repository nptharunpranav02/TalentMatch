import React from "react";
import { X, Mail, Award, Clock, IndianRupee, ArrowRight, Compass, CheckCircle2, ShieldCheck, MapPin, Briefcase } from "lucide-react";
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
  const estimatedDailyCost = 3500; // ₹3,500/day dev idle cost
  const totalIdleCost = benchDays * estimatedDailyCost;
  const monthlyBillableRunRate = 450000; // ₹4.5 Lakhs billable revenue recovery

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
                <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                  {employee.empCode || "TM-EMP"}
                </span>
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
              <p className="text-xs text-slate-500 mt-1">{employee.role} • {employee.band} • {employee.department}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Enterprise ROI & Bench Mitigation Card */}
            {isBench && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 to-orange-50/40 border border-amber-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                  Workforce Utilization & Cost Burn
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Current Idle Bench Time</span>
                    <strong className="text-base font-bold text-amber-900">{benchDays} Days</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Accrued Idle Overhead</span>
                    <strong className="text-base font-bold text-rose-700">₹{totalIdleCost.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
                <div className="border-t border-amber-200/60 pt-2 text-xs flex items-center justify-between text-slate-600">
                  <span>Revenue Unlock Potential:</span>
                  <strong className="text-blue-900 font-bold">₹{(monthlyBillableRunRate / 100000).toFixed(1)}L / month</strong>
                </div>
              </div>
            )}

            {/* Profile Credentials */}
            <div className="space-y-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Enterprise Credentials
              </span>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Corporate Email</span>
                <span className="font-semibold text-slate-900">{employee.email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Base Office</span>
                <span className="font-semibold text-slate-900">{employee.location}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Seniority Band</span>
                <span className="font-bold text-blue-900">{employee.band}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Verified Experience</span>
                <span className="font-semibold text-slate-900">{employee.experienceYears} Years</span>
              </div>
            </div>

            {/* Certifications */}
            {employee.certifications && employee.certifications.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Industry Certifications
                </span>
                <div className="space-y-1.5">
                  {employee.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="p-2 rounded-lg bg-blue-50/70 border border-blue-200/80 text-xs font-semibold text-blue-900 flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills Competency Breakdown */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Technical Proficiencies (Assessed)
              </span>
              <div className="space-y-2.5">
                {(employee.skills || []).map((skill) => {
                  const percent = (skill.proficiency / 5) * 100;
                  return (
                    <div key={skill.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-1.5 py-0.2 rounded text-[11px] font-semibold border ${getSkillBadgeClass(skill.name)}`}>
                          {skill.name}
                        </span>
                        <span className="text-slate-500 text-[11px] font-medium">{skill.years || 2}y verified experience</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Previous Project Contributions */}
            {employee.previousProjects && employee.previousProjects.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Past Project Portfolio
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.previousProjects.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700"
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Career Growth Aspirations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {employee.careerInterests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
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
              <span>Match with Active SOWs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
