import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Circle,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

/**
 * Format an ISO date string into a human-readable local datetime.
 */
function formatDateTime(iso) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ReminderCard – displays a single reminder with actions.
 *
 * Props:
 *   reminder      – reminder object { id, title, description, remindAt, isCompleted }
 *   variant       – "upcoming" | "dueOrOverdue" | "completed"
 *   onToggle      – (id) => void
 *   onEdit        – (reminder) => void
 *   onDelete      – (id) => void
 *   confirmingId  – id currently pending delete confirmation (or null)
 *   onConfirmDelete  – (id) => void  (actually deletes)
 *   onCancelDelete   – () => void
 */
export default function ReminderCard({
  reminder,
  variant,
  onToggle,
  onEdit,
  onDelete,
  confirmingId,
  onConfirmDelete,
  onCancelDelete,
}) {
  const isConfirming = confirmingId === reminder.id;

  const borderAccent =
    variant === "dueOrOverdue"
      ? "border-l-rose-400"
      : variant === "completed"
      ? "border-l-emerald-400"
      : "border-l-indigo-300";

  const timeLabel =
    variant === "dueOrOverdue"
      ? reminder.isCompleted
        ? null
        : new Date(reminder.remindAt) < new Date()
        ? "Overdue"
        : "Due Today"
      : null;

  return (
    <article
      className={`flex gap-3 border-l-4 ${borderAccent} p-4 transition hover:bg-slate-50 sm:gap-4 sm:p-5`}
    >
      {/* Complete toggle */}
      <button
        type="button"
        onClick={() => onToggle(reminder.id)}
        aria-label={
          reminder.isCompleted
            ? `Undo: mark "${reminder.title}" as incomplete`
            : `Mark "${reminder.title}" as complete`
        }
        className="mt-0.5 shrink-0 text-slate-300 hover:text-indigo-600"
      >
        {reminder.isCompleted ? (
          <CheckCircle2 size={23} className="text-emerald-500" />
        ) : (
          <Circle size={23} />
        )}
      </button>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <h3
          className={`break-words text-sm font-semibold sm:text-base ${
            reminder.isCompleted
              ? "text-slate-400 line-through"
              : "text-slate-800"
          }`}
        >
          {reminder.title}
        </h3>

        {reminder.description && (
          <p className="mt-1 break-words text-xs text-slate-500 sm:text-sm">
            {reminder.description}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarClock size={13} />
            {formatDateTime(reminder.remindAt)}
          </span>

          {timeLabel && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                timeLabel === "Overdue"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700"
              }`}
            >
              {timeLabel}
            </span>
          )}

          {reminder.isCompleted && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Completed
            </span>
          )}
        </div>

        {/* Inline delete confirmation */}
        {isConfirming && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3">
            <Trash2 size={15} className="shrink-0 text-rose-600" />
            <p className="flex-1 text-xs font-medium text-rose-700">
              Delete this reminder?
            </p>
            <button
              type="button"
              onClick={onCancelDelete}
              className="rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirmDelete(reminder.id)}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isConfirming && (
        <div className="flex shrink-0 items-start gap-1">
          {/* Undo / Edit */}
          {reminder.isCompleted ? (
            <button
              type="button"
              onClick={() => onToggle(reminder.id)}
              aria-label={`Undo complete: ${reminder.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEdit(reminder)}
              aria-label={`Edit ${reminder.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Pencil size={17} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(reminder.id)}
            aria-label={`Delete ${reminder.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      )}
    </article>
  );
}
