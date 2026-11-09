import React from "react";
import { AlertTriangle, AlertCircle, X, Check, ShieldAlert } from "lucide-react";

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Enterprise Action",
  message = "Are you sure you want to proceed with this operation?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // 'danger' | 'warning' | 'primary'
  details = null
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-rose-100 text-rose-600 border-rose-200",
      btnBg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
    },
    warning: {
      icon: AlertCircle,
      iconBg: "bg-amber-100 text-amber-700 border-amber-200",
      btnBg: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200"
    },
    primary: {
      icon: ShieldAlert,
      iconBg: "bg-blue-100 text-blue-700 border-blue-200",
      btnBg: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
    }
  };

  const style = variantStyles[variant] || variantStyles.primary;
  const Icon = style.icon;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-3 rounded-2xl border ${style.iconBg} shrink-0`}>
            <Icon className="h-6 w-6" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 id="confirm-modal-title" className="text-base font-extrabold text-slate-900">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {details && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            {details}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
            aria-label="Cancel action"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${style.btnBg}`}
            aria-label="Confirm action"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
