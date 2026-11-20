import { X, Bell } from "lucide-react";

/**
 * ToastBanner – fixed bottom-right stack of in-app reminder alerts.
 *
 * Props:
 *   toasts   – [{ id, title }]
 *   onDismiss – (id) => void
 */
export default function ToastBanner({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Reminder notifications"
      className="fixed bottom-5 right-5 z-[80] flex flex-col gap-3"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="flex w-72 items-start gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-xl ring-1 ring-indigo-100 sm:w-80"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Bell size={18} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Reminder Due
            </p>
            <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
              {toast.title}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            aria-label={`Dismiss reminder: ${toast.title}`}
            className="ml-1 mt-0.5 shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
