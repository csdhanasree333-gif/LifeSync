import { Trash2 } from "lucide-react";

export default function DeleteHabitDialog({ habitName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-habit-heading"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 size={23} />
        </div>
        <h2
          id="delete-habit-heading"
          className="mt-4 text-lg font-bold text-slate-900"
        >
          Delete this habit?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          <span className="font-semibold text-slate-700">
            &ldquo;{habitName}&rdquo;
          </span>{" "}
          and all its completion history will be removed permanently.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

