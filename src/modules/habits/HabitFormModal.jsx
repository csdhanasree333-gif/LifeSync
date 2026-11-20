import { useState } from "react";
import {
  X,
  Plus,
  Check,
  AlertCircle,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

const FREQUENCIES = ["daily", "weekly"];

const EMPTY_FORM = { name: "", frequency: "daily" };

export default function HabitFormModal({ onClose, onSave, initial = null }) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, frequency: initial.frequency }
      : { ...EMPTY_FORM }
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Please enter a habit name.");
      return;
    }
    if (!FREQUENCIES.includes(form.frequency)) {
      setError("Please select a valid frequency.");
      return;
    }
    onSave({ name, frequency: form.frequency });
  }

  const isEditing = Boolean(initial);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-form-heading"
        className="my-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">
              LifeSync / Habits
            </p>
            <h2
              id="habit-form-heading"
              className="mt-1 text-xl font-bold text-slate-900"
            >
              {isEditing ? "Edit Habit" : "Create New Habit"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEditing
                ? "Update your habit details below."
                : "Define a new habit to track your consistency."}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="habit-name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Habit name *
            </label>
            <input
              id="habit-name"
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setError("");
              }}
              placeholder="e.g. Morning run, Read 20 pages"
              maxLength={120}
              required
              autoFocus
              className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* Frequency */}
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">
              Frequency *
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {FREQUENCIES.map((freq) => {
                const active = form.frequency === freq;
                return (
                  <button
                    key={freq}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setForm({ ...form, frequency: freq })}
                    className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                      active
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-500 hover:border-violet-200 hover:bg-violet-50/40"
                    }`}
                  >
                    {freq === "daily" ? (
                      <RefreshCw size={18} />
                    ) : (
                      <CalendarDays size={18} />
                    )}
                    <span className="capitalize">{freq}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
            >
              <AlertCircle size={17} />
              {error}
            </p>
          )}

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
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
            >
              {isEditing ? <Check size={17} /> : <Plus size={18} />}
              {isEditing ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

