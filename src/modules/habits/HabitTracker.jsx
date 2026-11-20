import { useEffect, useState } from "react";
import {
  Plus,
  Activity,
  Flame,
  Trophy,
  CheckCircle2,
  RefreshCw,
  CalendarDays,
  Layers,
} from "lucide-react";
import {
  readHabits,
  saveHabits,
  createId,
  todayStr,
  calcStreaks,
  doneThisWeek,
} from "./habitUtils";
import HabitCard from "./HabitCard";
import HabitFormModal from "./HabitFormModal";
import DeleteHabitDialog from "./DeleteHabitDialog";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

export default function HabitTracker() {
  const [habits, setHabits] = useState(readHabits);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Persist on every change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const today = todayStr();
  const totalHabits = habits.length;
  // Daily: completed today; Weekly: completed at least once this ISO week
  const completedToday = habits.filter((h) =>
    h.frequency === "weekly"
      ? doneThisWeek(h.completedDates)
      : h.completedDates.includes(today)
  ).length;
  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, h.bestStreak),
    0
  );
  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.completedDates.length,
    0
  );

  const summary = [
    {
      label: "Total Habits",
      value: totalHabits,
      icon: Layers,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Done Today",
      value: `${completedToday}/${totalHabits}`,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      icon: Trophy,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Total Completions",
      value: totalCompletions,
      icon: Flame,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  // ── Filtered list ─────────────────────────────────────────────────────────
  const visibleHabits =
    filter === "all"
      ? habits
      : habits.filter((h) => h.frequency === filter);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function openCreate() {
    setEditingHabit(null);
    setShowForm(true);
  }

  function openEdit(habit) {
    setEditingHabit(habit);
    setShowForm(true);
  }

  function handleSave({ name, frequency }) {
    if (editingHabit) {
      // Edit: keep completedDates & streaks, only update name/frequency
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id !== editingHabit.id) return h;
          // If frequency changed, recalc streaks based on existing dates
          const updated = { ...h, name, frequency };
          const { currentStreak, bestStreak } = calcStreaks(updated);
          return { ...updated, currentStreak, bestStreak };
        })
      );
    } else {
      const newHabit = {
        id: createId(),
        name,
        frequency,
        completedDates: [],
        currentStreak: 0,
        bestStreak: 0,
      };
      setHabits((prev) => [newHabit, ...prev]);
    }
    setShowForm(false);
    setEditingHabit(null);
  }

  function handleToggleToday(id) {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const hasToday = h.completedDates.includes(today);
        const newDates = hasToday
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];

        const updated = { ...h, completedDates: newDates };
        const { currentStreak, bestStreak } = calcStreaks(updated);
        return {
          ...updated,
          currentStreak,
          bestStreak: Math.max(bestStreak, updated.bestStreak),
        };
      })
    );
  }

  function handleDelete(id) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setDeleteId(null);
  }

  const deletingHabit = deleteId ? habits.find((h) => h.id === deleteId) : null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-800 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-violet-600">
              <Activity size={17} />
              LifeSync
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Habit Tracker
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Build consistency, track streaks, and celebrate every small win.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
          >
            <Plus size={19} />
            New Habit
          </button>
        </header>

        {/* ── Summary cards ── */}
        <section className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {summary.map(({ label, value, icon: Icon, color }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`rounded-xl p-3 ${color}`}>
                  <Icon size={20} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            </article>
          ))}
        </section>

        {/* ── Filter tabs ── */}
        <section className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Habit filters">
          {FILTERS.map(({ label, value }) => {
            const count =
              value === "all"
                ? habits.length
                : habits.filter((h) => h.frequency === value).length;
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(value)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {value === "daily" && <RefreshCw size={14} />}
                {value === "weekly" && <CalendarDays size={14} />}
                {label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    active ? "bg-white/20" : "bg-slate-100"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </section>

        {/* ── Habit grid ── */}
        {visibleHabits.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={handleToggleToday}
                onEdit={openEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <Activity size={34} className="mx-auto text-violet-300" />
            <h3 className="mt-5 text-lg font-bold text-slate-800">
              {filter !== "all"
                ? `No ${filter} habits yet`
                : "No habits yet"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Create your first habit and start building consistency.
            </p>
            {filter === "all" && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                <Plus size={17} />
                Create your first habit
              </button>
            )}
          </div>
        )}

        {/* ── Footer note ── */}
        {habits.length > 0 && (
          <p className="mt-8 text-center text-xs text-slate-400">
            {habits.length} habit{habits.length === 1 ? "" : "s"} · Saved
            locally on this device
          </p>
        )}
      </div>

      {/* ── Modals ── */}
      {showForm && (
        <HabitFormModal
          initial={editingHabit}
          onClose={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
          onSave={handleSave}
        />
      )}

      {deleteId && deletingHabit && (
        <DeleteHabitDialog
          habitName={deletingHabit.name}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </main>
  );
}

