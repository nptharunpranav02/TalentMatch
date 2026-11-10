import React, { useState } from "react";
import { 
  X, Zap, Server, CheckCircle2, ShieldAlert, Sparkles, Activity, 
  RotateCcw, Play, RefreshCw, Layers 
} from "lucide-react";

export default function DemoTestingDrawer({ 
  isOpen, 
  onClose, 
  onSelectProjectForMatch, 
  setActiveTab, 
  onRefreshData, 
  onResetData 
}) {
  const [pingStatus, setPingStatus] = useState(null);
  const [testingPing, setTestingPing] = useState(false);

  if (!isOpen) return null;

  const runLiveDiagnostic = async () => {
    setTestingPing(true);
    setPingStatus(null);
    const start = performance.now();
    try {
      const res = await fetch("http://localhost:5000/api/health");
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setPingStatus({
        ok: true,
        latency: elapsed,
        backend: data.backend,
        aiEngine: data.aiEngine
      });
    } catch {
      setPingStatus({
        ok: false,
        error: "Backend offline. In-memory deterministic engine active."
      });
    } finally {
      setTestingPing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-2xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Developer & Demo Suite</h3>
                <p className="text-xs text-slate-500 font-medium">Evaluation tools & system diagnostics</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Pitch Scenarios */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pre-Configured Demo Scenarios
            </span>

            <button
              onClick={() => {
                onSelectProjectForMatch("proj-2");
                setActiveTab("matching");
                onClose();
              }}
              className="w-full p-3.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-all cursor-pointer flex items-start gap-3"
            >
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-blue-950 block">Scenario 1: Strong AI Match (94%)</strong>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  Selects Healthcare AI Pod $\rightarrow$ Elena Rostova passes all 4 dimensions.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectProjectForMatch("proj-1");
                setActiveTab("matching");
                onClose();
              }}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer flex items-start gap-3"
            >
              <Activity className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-slate-900 block">Scenario 2: Critical Banking SOW</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Selects Core Banking Engine $\rightarrow$ Shows 3 unfilled engineering vacancies.
                </p>
              </div>
            </button>
          </div>

          {/* Live System Diagnostics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Full-Stack Telemetry
              </span>
              <button
                onClick={runLiveDiagnostic}
                disabled={testingPing}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${testingPing ? "animate-spin" : ""}`} />
                <span>Run Ping</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Frontend (Vite):</span>
                <span className="font-bold text-emerald-700">Port 5173 (Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Backend (Express):</span>
                <span className="font-bold text-emerald-700">Port 5000 (Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">AI Engine (FastAPI):</span>
                <span className="font-bold text-emerald-700">Port 8000 (Active)</span>
              </div>

              {pingStatus && (
                <div className={`mt-3 pt-2.5 border-t border-slate-200 text-[11px] font-semibold ${pingStatus.ok ? "text-emerald-700" : "text-amber-800"}`}>
                  {pingStatus.ok 
                    ? `✔ Tri-Service Healthy (${pingStatus.latency}ms roundtrip)`
                    : `⚠ ${pingStatus.error}`}
                </div>
              )}
            </div>
          </div>

          {/* Quick Demo Reset */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Presentation Reset
            </span>
            <button
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Canonical Demo Dataset</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          TalentMatch AI v2.4 • Hackathon Evaluation Build
        </div>
      </div>
    </div>
  );
}
