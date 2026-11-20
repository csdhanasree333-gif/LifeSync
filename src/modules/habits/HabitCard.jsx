import { useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Flame,
  Trophy,
  RefreshCw,
  CalendarDays,
} from "lucide-react";
import CompletionGrid from "./CompletionGrid";
import { todayStr } from "./habitUtils";

export default function HabitCard({ habit, onToggleToday, onEdit, onDelete }) {
  const [gridDays, setGridDays] = useState(7);
  const today = todayStr();
  const doneToday = habit.completedDates.includes(today);

  const freqColor =
    habit.frequency === "daily"
      ? "bg-indigo-50 text-indigo-600"
      : "bg-amber-50 text-amber-600";

  const FreqIcon = habit.frequency === "daily" ? RefreshCw : CalendarDays;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Top bar */}
      <div className="flex items-start gap-3 p-4 sm:p-5">
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => onToggleToday(habit.id)}
          aria-label={doneToday ? "Unmark today" : "Mark completed today"}
          className="mt-0.5 shrink-0 text-slate-300 transition hover:scale-110 hover:text-violet-600"
        >
          {doneToday ? (
            <CheckCircle2 size={26} className="text-violet-500" />
          ) : (
            <Circle size={26} />
          )}
        </button>

        {/* Name & badges */}
        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-base font-bold ${
              doneToday ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {habit.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Frequency */}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${freqColor}`}
            >
              <FreqIcon size={11} />
              {habit.frequency === "daily" ? "Daily" : "Weekly"}
            </span>

            {/* Current streak */}
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
              <Flame size={11} />
              {habit.currentStreak} day streak
            </span>

            {/* Best streak */}
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              <Trophy size={11} />
              Best: {habit.bestStreak}
            </span>

            {/* Done today badge */}
            {doneToday && (
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                ✓ Done today
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(habit)}
            aria-label={`Edit ${habit.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-violet-50 hover:text-violet-600"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete ${habit.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Mark completed CTA (if not done) */}
      {!doneToday && (
        <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => onToggleToday(habit.id)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <CheckCircle2 size={17} />
            Mark Completed Today
          </button>
        </div>
      )}

      {/* Completion History */}
      <div className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5">
        {/* Toggle 7 / 30 days */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Completion History
          </span>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 text-xs font-semibold">
            {[7, 30].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setGridDays(n)}
                className={`px-2.5 py-1 transition ${
                  gridDays === n
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {n}d
              </button>
            ))}
          </div>
        </div>
        <CompletionGrid completedDates={habit.completedDates} days={gridDays} />
      </div>
    </article>
  );
}

