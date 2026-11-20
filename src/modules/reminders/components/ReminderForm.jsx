import { AlertCircle, CalendarDays, Check, Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const EMPTY_FORM = { title: "", description: "", remindAt: "" };

/**
 * ReminderForm – modal dialog for creating or editing a reminder.
 *
 * Props:
 *   initial   – existing reminder object (edit mode) or null (create mode)
 *   onSave    – ({ title, description, remindAt }) => void
 *   onClose   – () => void
 */
export default function ReminderForm({ initial, onSave, onClose }) {
  const headingId = useId();
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          // Convert ISO to datetime-local value: "YYYY-MM-DDTHH:mm"
          remindAt: initial.remindAt
            ? initial.remindAt.slice(0, 16)
            : "",
        }
      : { ...EMPTY_FORM }
  );
  const [errors, setErrors] = useState({});

  // Trap focus inside the dialog on mount
  useEffect(() => {
    const prev = document.activeElement;
    return () => prev?.focus();
  }, []);

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.remindAt) {
      e.remindAt = "Date & time is required.";
    }
    return e;
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      remindAt: new Date(form.remindAt).toISOString(),
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              LifeSync / Reminders
            </p>
            <h2
              id={headingId}
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {initial ? "Edit Reminder" : "New Reminder"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {initial
                ? "Update the reminder details below."
                : "Set a title, time, and optional note."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="reminder-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Title <span aria-hidden="true">*</span>
            </label>
            <input
              id="reminder-title"
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g. Take medication"
              maxLength={200}
              autoFocus
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={`min-h-12 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-4 ${
                errors.title
                  ? "border-rose-400 focus:border-rose-400 focus:ring-rose-50"
                  : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
              }`}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-xs text-rose-600"
              >
                <AlertCircle size={13} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label
              htmlFor="reminder-at"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Date &amp; Time <span aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="reminder-at"
                type="datetime-local"
                value={form.remindAt}
                onChange={(e) => handleChange("remindAt", e.target.value)}
                aria-required="true"
                aria-invalid={!!errors.remindAt}
                aria-describedby={errors.remindAt ? "time-error" : undefined}
                className={`min-h-12 w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm outline-none focus:ring-4 ${
                  errors.remindAt
                    ? "border-rose-400 focus:border-rose-400 focus:ring-rose-50"
                    : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-50"
                }`}
              />
            </div>
            {errors.remindAt && (
              <p
                id="time-error"
                role="alert"
                className="mt-2 flex items-center gap-1.5 text-xs text-rose-600"
              >
                <AlertCircle size={13} />
                {errors.remindAt}
              </p>
            )}
          </div>

          {/* Description (optional) */}
          <div>
            <label
              htmlFor="reminder-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Description{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="reminder-description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Any extra notes…"
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            >
              {initial ? (
                <>
                  <Check size={17} />
                  Save Changes
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Reminder
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
