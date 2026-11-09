import React, { useState } from "react";
import { CheckSquare, CheckCircle2, XCircle, Clock, Zap, MessageSquare, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "../services/api";

export default function Approvals({ allocations, onAllocationReviewed }) {
  const [activeTab, setActiveTab] = useState("PENDING"); // "PENDING" | "HISTORY"
  const [notesMap, setNotesMap] = useState({});
  const [processingId, setProcessingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const pendingAllocations = allocations.filter((a) => a.status === "PENDING_APPROVAL");
  const historyAllocations = allocations.filter((a) => a.status !== "PENDING_APPROVAL");

  const displayed = activeTab === "PENDING" ? pendingAllocations : historyAllocations;

  const handleReview = async (allocationId, decision) => {
    setProcessingId(allocationId);
    try {
      const note = notesMap[allocationId] || "";
      await api.reviewAllocation(allocationId, decision, note);

      const decisionText = decision === "APPROVED" ? "Approved & Allocated" : "Rejected";
      setToastMessage(`Allocation ${decisionText}! Employee profile and project counters updated.`);

      if (onAllocationReviewed) {
        onAllocationReviewed();
      }

      setTimeout(() => setToastMessage(null), 4000);
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Managerial Governance & Sign-off</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manager Approval Inbox
          </h1>
          <p className="text-sm text-slate-500">
            Review AI recommended talent allocations, review technical rationale, and authorize project assignments.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === "PENDING"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Pending Approvals</span>
            {pendingAllocations.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {pendingAllocations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === "HISTORY"
                ? "bg-slate-900 text-white font-semibold shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Review History ({historyAllocations.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {displayed.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === "PENDING" ? "All caught up! Zero pending approvals" : "No history recorded yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeTab === "PENDING"
              ? "New AI recommendations submitted from the AI Matcher will appear here for your review."
              : "Past approved and rejected allocations will be logged here."}
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
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Header: Project and Candidate */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      AI
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{alloc.employeeName}</h3>
                        <span className="text-xs text-slate-400">→</span>
                        <h3 className="font-bold text-indigo-700 text-sm">{alloc.projectName}</h3>
                      </div>
                      <p className="text-xs text-slate-500">
                        Role: {alloc.employeeRole} • Proposed: {new Date(alloc.proposedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Score */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      AI Score: {alloc.aiMatchScore}%
                    </div>
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Explanation Quote */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2.5">
                  <Zap className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                      AI Matching Analysis
                    </span>
                    <p className="leading-relaxed">{alloc.aiExplanation}</p>
                  </div>
                </div>

                {/* Manager Actions or Audit Info */}
                {isPending ? (
                  <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="w-full md:w-2/3">
                      <input
                        type="text"
                        placeholder="Add manager review feedback or onboarding note (optional)..."
                        value={notesMap[alloc.id] || ""}
                        onChange={(e) =>
                          setNotesMap({ ...notesMap, [alloc.id]: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => handleReview(alloc.id, "REJECTED")}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => handleReview(alloc.id, "APPROVED")}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve Allocation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span>
                      Reviewed on: {new Date(alloc.reviewedAt || alloc.proposedAt).toLocaleString()}
                    </span>
                    {alloc.managerNotes && (
                      <span className="italic text-slate-600">Note: "{alloc.managerNotes}"</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
