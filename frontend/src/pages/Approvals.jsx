import React, { useState } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { api } from "../services/api";

export default function Approvals({ allocations, onAllocationReviewed }) {
  const [activeTab, setActiveTab] = useState("PENDING");
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

      const decisionText = decision === "APPROVED" ? "Approved" : "Rejected";
      setToastMessage(`Allocation ${decisionText}. Employee availability updated.`);

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
    <div className="space-y-5">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Allocation Approvals</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review proposed bench allocations and finalize project assignments.
          </p>
        </div>

        {/* Tab Toggle with Natural Amber Highlights */}
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-2xs">
          <button
            onClick={() => setActiveTab("PENDING")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === "PENDING"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Pending</span>
            {pendingAllocations.length > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {pendingAllocations.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === "HISTORY"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            History ({historyAllocations.length})
          </button>
        </div>
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">
            {activeTab === "PENDING" ? "All caught up! Zero pending allocations" : "No review history recorded yet"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === "PENDING"
              ? "Proposals submitted from the Matching tab will appear here for managerial sign-off."
              : "Decisions made on allocations will be archived here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((alloc) => {
            const isPending = alloc.status === "PENDING_APPROVAL";
            const isApproved = alloc.status === "APPROVED";
            const isRejected = alloc.status === "REJECTED";

            return (
              <div
                key={alloc.id}
                className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">{alloc.employeeName}</span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className="font-semibold text-blue-900 text-sm">{alloc.projectName}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Role: {alloc.employeeRole} • Proposed: {new Date(alloc.proposedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      Match: {alloc.aiMatchScore}%
                    </span>
                    {isPending && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Sign-off
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Summary */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <p className="leading-relaxed">{alloc.aiExplanation}</p>
                </div>

                {/* Actions with Natural Colors */}
                {isPending ? (
                  <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="Add manager notes or onboarding instructions (optional)..."
                      value={notesMap[alloc.id] || ""}
                      onChange={(e) =>
                        setNotesMap({ ...notesMap, [alloc.id]: e.target.value })
                      }
                      className="w-full sm:w-2/3 px-3 py-1.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:border-blue-400 bg-white"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => handleReview(alloc.id, "REJECTED")}
                        className="px-3.5 py-1.5 rounded-md border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        disabled={processingId === alloc.id}
                        onClick={() => handleReview(alloc.id, "APPROVED")}
                        className="px-4 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                      >
                        Approve Allocation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                    <span>Reviewed: {new Date(alloc.reviewedAt || alloc.proposedAt).toLocaleDateString()}</span>
                    {alloc.managerNotes && (
                      <span className="text-slate-700 font-medium italic">Note: "{alloc.managerNotes}"</span>
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
