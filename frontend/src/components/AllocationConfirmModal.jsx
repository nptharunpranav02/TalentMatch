import React, { useState } from "react";
import { X, CheckCircle2, Calendar, FileText, UserCheck, ShieldCheck, ArrowRight, Building2, Sparkles, AlertCircle } from "lucide-react";
import { getAvatarColor, getInitials } from "../utils/skillColors";
import { useOrg } from "../context/OrgContext";

export default function AllocationConfirmModal({
  isOpen,
  onClose,
  candidate,
  project,
  onConfirmAllocation
}) {
  const { formatMoney } = useOrg();
  const [effectiveStartDate, setEffectiveStartDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const maxCapacity = candidate?.employee?.availableCapacityPercentage ?? (candidate?.employee?.availabilityStatus === "BENCH" ? 100 : 0);
  const [allocationPercentage, setAllocationPercentage] = useState(
    maxCapacity >= 100 ? 100 : (maxCapacity >= 50 ? 50 : (maxCapacity >= 25 ? 25 : 100))
  );
  const [managerNotes, setManagerNotes] = useState("");
  const [allocationMode, setAllocationMode] = useState("PENDING"); // "PENDING" | "DIRECT"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !candidate || !project) return null;

  const emp = candidate.employee;
  const avatar = getAvatarColor(emp.name);
  const initials = getInitials(emp.name);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await onConfirmAllocation({
        employeeId: emp.id,
        projectId: project.id,
        allocationPercentage,
        aiMatchScore: candidate.aiMatchScore,
        scoreBreakdown: candidate.scoreBreakdown,
        aiExplanation: candidate.aiExplanation,
        effectiveStartDate,
        managerNotes,
        directAuthorize: allocationMode === "DIRECT"
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to finalize allocation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Confirm Project Allocation</h2>
              <p className="text-xs text-slate-500 font-medium">Step 6 of 7: Review AI recommendation & authorize assignment</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-bold">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleConfirm} className="p-6 space-y-4.5">
          {/* Candidate & Project Pair Overview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-xs ${avatar.bg} ${avatar.text} ${avatar.border} border shadow-2xs shrink-0`}>
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 font-bold">
                      {emp.empCode}
                    </span>
                    <strong className="text-slate-900 text-sm font-extrabold">{emp.name}</strong>
                  </div>
                  <p className="text-slate-500 text-[11px] font-medium">{emp.band} • {emp.role}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase block">Match Score</span>
                <span className="text-xl font-black text-blue-700">{candidate.aiMatchScore}%</span>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-slate-700">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-900">{project.name}</span>
                <span className="font-mono text-[10px] text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">({project.projectCode})</span>
              </div>
              <span className="font-bold text-slate-800 text-[11px]">{project.client}</span>
            </div>
          </div>

          {/* AI Explainable Summary */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
              <span>Technical Fit: <strong className="text-blue-700">{candidate.scoreBreakdown?.technicalFit || 50}/60</strong></span>
              <span>•</span>
              <span>Seniority Gate: <strong className="text-emerald-700">{candidate.scoreBreakdown?.experienceFit || 25}/25</strong></span>
              <span>•</span>
              <span>Aspiration Fit: <strong className="text-indigo-700">{candidate.scoreBreakdown?.aspirationFit || 15}/15</strong></span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium italic">
              "{candidate.aiExplanation}"
            </p>
          </div>

          {/* Form Fields: Effective Date & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Effective Start Date *
              </label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white">
                <Calendar className="h-4 w-4 text-blue-600" />
                <input
                  type="date"
                  required
                  value={effectiveStartDate}
                  onChange={(e) => setEffectiveStartDate(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Billing Rate
              </label>
              <div className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900">
                {formatMoney(project.monthlyRevenuePerDev || 14000)} / month per engineer
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Allocation Capacity / FTE Time-Slice *
              </label>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Available: {maxCapacity}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { pct: 100, label: "100% Full-Time", fte: "1.0 FTE" },
                { pct: 50, label: "50% Shared Pod", fte: "0.5 FTE" },
                { pct: 25, label: "25% Advisory", fte: "0.25 FTE" }
              ].map((opt) => {
                const isExceeded = opt.pct > maxCapacity;
                const isSelected = allocationPercentage === opt.pct;
                return (
                  <button
                    key={opt.pct}
                    type="button"
                    disabled={isExceeded}
                    onClick={() => setAllocationPercentage(opt.pct)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isExceeded
                        ? "opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300 shadow-2xs"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-extrabold text-slate-900 text-xs">{opt.label}</div>
                    <div className="text-[10px] font-bold text-blue-600 mt-0.5">{opt.fte}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Manager Onboarding Remarks / SOW Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Cleared technical interview; client background check in progress; starting in Sprint 14..."
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 font-medium"
            />
          </div>

          {/* Allocation Mode: Governance Approval vs Direct Allocation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Governance Sign-off Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                allocationMode === "PENDING"
                  ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-200"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="allocMode"
                    value="PENDING"
                    checked={allocationMode === "PENDING"}
                    onChange={() => setAllocationMode("PENDING")}
                    className="accent-amber-600"
                  />
                  <span className="font-extrabold text-amber-950">Manager Review (Pending)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-5 font-medium">
                  Enters approval inbox for Director review & compliance audit.
                </p>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                allocationMode === "DIRECT"
                  ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-200"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="allocMode"
                    value="DIRECT"
                    checked={allocationMode === "DIRECT"}
                    onChange={() => setAllocationMode("DIRECT")}
                    className="accent-emerald-600"
                  />
                  <span className="font-extrabold text-emerald-950">Direct Authorize (Active)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 pl-5 font-medium">
                  Immediately updates employee to Allocated and increments SOW seats.
                </p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 ${
                allocationMode === "DIRECT"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {isSubmitting
                  ? "Processing..."
                  : allocationMode === "DIRECT"
                  ? "Authorize & Allocate Now"
                  : "Submit for Manager Sign-off"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
