import React from "react";
import { X, Building2, Check, ArrowRight, ShieldCheck, Plus, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SwitchOrgModal({ isOpen, onClose, onOpenRegister }) {
  const { currentOrg, availableOrgs, switchOrg } = useAuth();

  if (!isOpen) return null;

  const handleSelectOrg = async (org) => {
    try {
      await switchOrg(org.email);
      onClose();
    } catch (err) {
      alert("Failed to switch organization space: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Switch Organization Workspace</h2>
              <p className="text-xs text-slate-500 font-medium">Jump between dedicated enterprise tenant spaces</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Organization Cards List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Available Dedicated Enterprise Spaces:
          </span>

          {availableOrgs.map((org) => {
            const isCurrent = currentOrg?.id === org.id;
            return (
              <div
                key={org.id}
                onClick={() => !isCurrent && handleSelectOrg(org)}
                className={`p-4 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                  isCurrent
                    ? "bg-blue-50/60 border-blue-400 ring-2 ring-blue-100 shadow-2xs cursor-default"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isCurrent ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 text-sm font-bold truncate">{org.name}</strong>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                          Active Space
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium mt-0.5">{org.industry || "Enterprise IT & Services"}</p>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{org.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCurrent ? (
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <span>Switch Space</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">Zero cross-tenant data leakage guaranteed.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
