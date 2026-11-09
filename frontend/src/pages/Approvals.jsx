import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock, ShieldCheck, UserCheck, Calendar, ArrowRight, FileCheck, Check, AlertTriangle } from "lucide-react";
import { api } from "../services/api";
import ConfirmActionModal from "../components/ConfirmActionModal";

export default function Approvals({ allocations, onAllocationReviewed, setActiveTab }) {
  const [approvalTab, setApprovalTab] = useState("PENDING");
  const [notesMap, setNotesMap] = useState({});
  const [startDateMap, setStartDateMap] = useState({});
  const [processingId, setProcessingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [rejectConfirmAlloc, setRejectConfirmAlloc] = useState(null);

  const pendingAllocations = allocations.filter((a) => a.status === "PENDING_APPROVAL");
  const historyAllocations = allocations.filter((a) => a.status !== "PENDING_APPROVAL");

  const displayed = approvalTab === "PENDING" ? pendingAllocations : historyAllocations;

  const handleReview = async (allocationId, decision) => {
    setProcessingId(allocationId);
    try {
      const note = notesMap[allocationId] || "";
      await api.reviewAllocation(allocationId, decision, note);

      const decisionText = decision === "APPROVED" ? "Authorized & Staffed" : "Rejected";
      setToastMessage(`SOW Allocation ${decisionText}. Employee roster & SOW quotas updated.`);

      if (onAllocationReviewed) {
        onAllocationReviewed();
      }

      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Review failed", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Managerial Governance & Sign-off</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
              Audit-Ready SOW Sign-off
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Review AI recommended talent proposals, verify billing rates, and authorize project SOW allocations.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-bold">
            <span className="text-slate-400 font-medium">Workflow:</span>
            <button
              onClick={() => setActiveTab && setActiveTab("dashboard")}
              className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              ← Back to Dashboard
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab && setActiveTab("matching")}
              className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              AI Matching Engine →
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setActiveTab && setActiveTab("analytics")}
              className="text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Workforce Analytics →
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-bold shadow-2xs">
          <button
            onClick={() => setApprovalTab("PENDING")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              approvalTab === "PENDING"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>Pending Review</span>
            {pendingAllocations.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                approvalTab === "PENDING" ? "bg-amber-400 text-amber-950" : "bg-amber-100 text-amber-900 border border-amber-300"
              }`}>
                {pendingAllocations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setApprovalTab("HISTORY")}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              approvalTab === "HISTORY"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Sign-off Audit History ({historyAllocations.length})
          </button>
        </div>
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            {approvalTab === "PENDING" ? "All caught up! Zero pending allocations" : "No review history recorded yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {approvalTab === "PENDING"
              ? "Proposals submitted from the Matching tab will appear here for managerial sign-off and audit tracking."
              : "Decisions made on allocations will be archived here for compliance auditing and SOC2 compliance."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((alloc) => {
            const isPending = alloc.status === "PENDING_APPROVAL";
            const isApproved = alloc.status === "APPROVED";
            const isRejected = alloc.status === "REJECTED";

            return (
              <div
                key={alloc.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:border-blue-300 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {alloc.empCode || "TM-EMP"}
                      </span>
                      <strong className="text-slate-900 text-base font-extrabold">{alloc.employeeName}</strong>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                      <strong className="text-blue-700 text-base font-extrabold">{alloc.projectName}</strong>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                        {alloc.projectCode || "PRJ-SOW"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Band: <strong className="text-indigo-700">{alloc.employeeBand || "L4"}</strong> • Client: <strong className="text-slate-800">{alloc.clientName || "Enterprise Client"}</strong> • Proposed: {new Date(alloc.proposedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-start lg:self-auto">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                      Match: {alloc.aiMatchScore}%
                    </span>
                    {isPending && (
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        🟡 PENDING APPROVAL
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                        🟢 ALLOCATED (CONFIRMED)
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
                        🔴 REJECTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Breakdown & Rationale */}
                <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs">
                  {alloc.scoreBreakdown && (
                    <div className="flex items-center gap-4 text-xs text-slate-600 pb-2 border-b border-slate-200/60 flex-wrap font-medium">
                      <span>Technical Competency: <strong className="text-blue-700 font-bold">{alloc.scoreBreakdown.technicalFit}/60</strong></span>
                      <span>•</span>
                      <span>Seniority Gate: <strong className="text-emerald-700 font-bold">{alloc.scoreBreakdown.experienceFit}/25</strong></span>
                      <span>•</span>
                      <span>Aspiration Fit: <strong className="text-indigo-700 font-bold">{alloc.scoreBreakdown.aspirationFit}/15</strong></span>
                    </div>
                  )}
                  <p className="text-slate-800 leading-relaxed font-medium">{alloc.aiExplanation}</p>
                </div>

                {/* Governance Actions with Date Picker */}
                {isPending ? (
                  <div className="pt-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1">
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs shadow-2xs">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <input
                          type="date"
                          defaultValue="2026-11-15"
                          onChange={(e) => setStartDateMap({ ...startDateMap, [alloc.id]: e.target.value })}
                          className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
                          title="Effective Start Date"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Add manager onboarding remarks or deployment notes (optional)..."
                        value={notesMap[alloc.id] || ""}
                        onChange={(e) =>
                          setNotesMap({ ...notesMap, [alloc.id]: e.target.value })
                        }
                        className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 bg-white shadow-2xs font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2.5 justify-end">
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => setRejectConfirmAlloc(alloc)}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        Reject
                      </button>
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => handleReview(alloc.id, "APPROVED")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-emerald-200 flex items-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        <span>Authorize SOW Allocation</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span>Authorized on: <strong className="text-slate-800">{new Date(alloc.reviewedAt || alloc.proposedAt).toLocaleDateString()}</strong> by Engineering Director</span>
                    {alloc.managerNotes && (
                      <span className="text-slate-700 font-bold italic bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        "{alloc.managerNotes}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
          {/* 4.11: Action Confirmation Modal for Rejections */}
      <ConfirmActionModal
        isOpen={Boolean(rejectConfirmAlloc)}
        onClose={() => setRejectConfirmAlloc(null)}
        onConfirm={() => {
          if (rejectConfirmAlloc) {
            handleReview(rejectConfirmAlloc.id, "REJECTED");
            setRejectConfirmAlloc(null);
          }
        }}
        title="Decline SOW Allocation Proposal"
        message={`Are you sure you want to decline the proposed assignment of ${rejectConfirmAlloc?.employeeName} for ${rejectConfirmAlloc?.projectName}? This decision will be stamped in the audit trail.`}
        confirmText="Confirm Rejection"
        variant="danger"
      />
    </div>
  );
}
