import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import ReminderCard from "./ReminderCard";

/**
 * ReminderSection – collapsible titled list with an empty state.
 *
 * Props:
 *   title        – section heading string
 *   icon         – lucide icon component
 *   iconClass    – Tailwind colour class for the icon
 *   badgeClass   – Tailwind classes for the count badge
 *   emptyIcon    – lucide icon component shown in the empty state
 *   emptyText    – string shown when list is empty
 *   reminders    – filtered reminder array for this section
 *   variant      – "upcoming" | "dueOrOverdue" | "completed"
 *   confirmingId – id currently awaiting delete confirmation (or null)
 *   onToggle     – (id) => void
 *   onEdit       – (reminder) => void
 *   onDelete     – (id) => void
 *   onConfirmDelete – (id) => void
 *   onCancelDelete  – () => void
 *   defaultOpen  – boolean (default true)
 */
export default function ReminderSection({
  title,
  icon: Icon,
  iconClass,
  badgeClass,
  emptyIcon: EmptyIcon,
  emptyText,
  reminders,
  variant,
  confirmingId,
  onToggle,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300"
      >
        <div className="flex items-center gap-3">
          <span className={`${iconClass}`}>
            <Icon size={18} />
          </span>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <span
            className={`min-w-[1.5rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold ${badgeClass}`}
          >
            {reminders.length}
          </span>
        </div>
        <span className="text-slate-400">
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      {/* Body */}
      {open && (
        <>
          {reminders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <EmptyIcon size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">
                {emptyText}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  variant={variant}
                  confirmingId={confirmingId}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onConfirmDelete={onConfirmDelete}
                  onCancelDelete={onCancelDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
