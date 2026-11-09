import React from "react";
import { 
  LayoutGrid, Users, Briefcase, Sparkles, CheckSquare, TrendingUp, 
  ChevronRight, CheckCircle2 
} from "lucide-react";

export default function WorkflowNavigationHub({ activeTab, setActiveTab, pendingCount = 0 }) {
  const workflowCards = [
    {
      id: "dashboard",
      step: "1. Dashboard",
      desc: "Overall workforce status",
      icon: LayoutGrid,
      iconColor: "text-blue-600",
      bgClass: "bg-blue-50/70 hover:bg-blue-100/80 border-blue-100",
      activeRing: "ring-2 ring-blue-600 shadow-md shadow-blue-500/10"
    },
    {
      id: "employees",
      step: "2. Employees",
      desc: "Employee profiles and skills",
      icon: Users,
      iconColor: "text-blue-600",
      bgClass: "bg-blue-50/70 hover:bg-blue-100/80 border-blue-100",
      activeRing: "ring-2 ring-blue-600 shadow-md shadow-blue-500/10"
    },
    {
      id: "projects",
      step: "3. Projects",
      desc: "Project requirements and vacancies",
      icon: Briefcase,
      iconColor: "text-blue-600",
      bgClass: "bg-blue-50/70 hover:bg-blue-100/80 border-blue-100",
      activeRing: "ring-2 ring-blue-600 shadow-md shadow-blue-500/10"
    },
    {
      id: "matching",
      step: "4. AI Matching",
      desc: "Intelligent recommendations",
      icon: Sparkles,
      iconColor: "text-purple-600",
      bgClass: "bg-purple-50/70 hover:bg-purple-100/80 border-purple-100",
      activeRing: "ring-2 ring-purple-600 shadow-md shadow-purple-500/10"
    },
    {
      id: "approvals",
      step: "5. Approvals",
      desc: "Manager authorization",
      icon: CheckSquare,
      iconColor: "text-emerald-600",
      badge: pendingCount,
      bgClass: "bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-100",
      activeRing: "ring-2 ring-emerald-600 shadow-md shadow-emerald-500/10"
    },
    {
      id: "analytics",
      step: "6. Analytics",
      desc: "Utilization and bench risks",
      icon: TrendingUp,
      iconColor: "text-amber-600",
      bgClass: "bg-amber-50/70 hover:bg-amber-100/80 border-amber-100",
      activeRing: "ring-2 ring-amber-600 shadow-md shadow-amber-500/10"
    }
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-7 mb-7 transition-all">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/20 shrink-0">
            TM
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">TalentMatch AI</h2>
            <p className="text-xs text-slate-500 font-medium">Intelligent Workforce Allocation</p>
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs">
          Manager Portal
        </span>
      </div>

      {/* Main Navigation Section */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Main navigation</h3>
          <span className="text-[11px] font-semibold text-slate-400">Click any module to navigate workflow</span>
        </div>

        {/* 2-Column x 3-Row Grid Matching User Specification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {workflowCards.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-4 ${item.bgClass} ${
                  isActive ? `${item.activeRing} scale-[1.01]` : "hover:scale-[1.008]"
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-white/90 shadow-2xs shrink-0 ${item.iconColor} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-extrabold text-slate-900 block tracking-tight">
                      {item.step}
                    </strong>
                    {item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-300">
                        {item.badge} Pending
                      </span>
                    )}
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-900 text-white shadow-2xs">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
