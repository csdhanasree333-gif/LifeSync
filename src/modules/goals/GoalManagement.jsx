import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Plus,
  Search,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Trophy,
  Sparkles,
  TrendingUp,
  RotateCcw,
  ListTodo,
} from "lucide-react";

const STORAGE_KEY = "lifesync_goals";

const FILTERS = [
  { label: "All", value: "All" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  targetDate: "",
  progress: 0,
};

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function readGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) return [];

    return saved
      .filter((goal) => goal && typeof goal.title === "string")
      .map((goal) => {
        const progress = Math.min(
          100,
          Math.max(0, typeof goal.progress === "number" ? goal.progress : Number(goal.progress) || 0)
        );
        const status =
          progress === 100 || goal.status === "Completed"
            ? "Completed"
            : "In Progress";

        return {
          id: String(goal.id || createId()),
          title: String(goal.title || ""),
          description: String(goal.description || ""),
          targetDate: String(goal.targetDate || ""),
          progress,
          status,
          createdAt: String(goal.createdAt || new Date().toISOString()),
        };
      });
  } catch (err) {
    console.error("Unable to read goals from localStorage:", err);
    return [];
  }
}

function formatDate(value) {
  if (!value) return "No target date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDeadlineInfo(targetDate, status) {
  if (status === "Completed") {
    return {
      label: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      isOverdue: false,
    };
  }

  if (!targetDate) {
    return {
      label: "No deadline",
      badgeClass: "bg-slate-50 text-slate-600 ring-slate-200",
      isOverdue: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${targetDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return {
      label: "Invalid date",
      badgeClass: "bg-slate-50 text-slate-600 ring-slate-200",
      isOverdue: false,
    };
  }

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: `Overdue by ${overdueDays}d`,
      badgeClass: "bg-rose-50 text-rose-700 ring-rose-200",
      isOverdue: true,
    };
  }

  if (diffDays === 0) {
    return {
      label: "Due Today",
      badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
      isOverdue: false,
    };
  }

  if (diffDays === 1) {
    return {
      label: "Due Tomorrow",
      badgeClass: "bg-blue-50 text-blue-700 ring-blue-200",
      isOverdue: false,
    };
  }

  return {
    label: `${diffDays} days left`,
    badgeClass: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    isOverdue: false,
  };
}

export default function GoalManagement() {
  const [goals, setGoals] = useState(readGoals);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  // Persist goals to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (err) {
      console.error("Unable to save goals:", err);
    }
  }, [goals]);

  // Derived metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "Completed").length;
  const inProgressGoals = totalGoals - completedGoals;
  const avgProgress =
    totalGoals > 0
      ? Math.round(
          goals.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalGoals
        )
      : 0;

  // Filtered goals
  const visibleGoals = goals.filter((goal) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "In Progress" && goal.status === "In Progress") ||
      (filter === "Completed" && goal.status === "Completed");

    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      goal.title.toLowerCase().includes(query) ||
      goal.description.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  // Modal Handlers
  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowModal(true);
  }

  function openEdit(goal) {
    setEditingId(goal.id);
    setForm({
      title: goal.title,
      description: goal.description || "",
      targetDate: goal.targetDate || "",
      progress: goal.progress || 0,
    });
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  }

  function handleSaveGoal(event) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();
    const targetDate = form.targetDate;

    if (!title) {
      setError("Please enter a goal title.");
      return;
    }

    if (!targetDate || Number.isNaN(new Date(`${targetDate}T00:00:00`).getTime())) {
      setError("Please select a valid target date.");
      return;
    }

    const progress = Math.min(100, Math.max(0, Number(form.progress) || 0));
    const status = progress === 100 ? "Completed" : "In Progress";

    if (editingId) {
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === editingId
            ? {
                ...goal,
                title,
                description,
                targetDate,
                progress,
                status,
              }
            : goal
        )
      );
    } else {
      const newGoal = {
        id: createId(),
        title,
        description,
        targetDate,
        progress,
        status,
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [newGoal, ...prev]);
    }

    closeModal();
  }

  // Quick Progress Actions
  function updateGoalProgress(id, nextProgress) {
    const clamped = Math.min(100, Math.max(0, Math.round(nextProgress)));
    const newStatus = clamped === 100 ? "Completed" : "In Progress";

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress: clamped,
              status: newStatus,
            }
          : goal
      )
    );
  }

  function handleQuickIncrement(id, delta) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    updateGoalProgress(id, goal.progress + delta);
  }

  function handleToggleManualComplete(id) {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== id) return goal;

        if (goal.status === "Completed") {
          // Reopen goal: set status to In Progress and reset progress to 0
          return {
            ...goal,
            status: "In Progress",
            progress: 0,
          };
        } else {
          // Mark complete: set status to Completed and progress to 100
          return {
            ...goal,
            status: "Completed",
            progress: 100,
          };
        }
      })
    );
  }

  function handleDeleteGoal(id) {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    setDeleteId(null);
  }

  const goalToDelete = goals.find((g) => g.id === deleteId);

  const summaryCards = [
    {
      label: "Total Goals",
      value: totalGoals,
      icon: Target,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "In Progress",
      value: inProgressGoals,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: completedGoals,
      icon: Trophy,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Average Progress",
      value: `${avgProgress}%`,
      icon: TrendingUp,
      color: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-800 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Goal Management
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Set inspiring milestones, track measurable progress, and celebrate accomplishments.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
          >
            <Plus size={19} />
            Create Goal
          </button>
        </header>

        {/* Metric Summary Grid */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon, color }) => (
            <article
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`rounded-xl p-3 ${color}`}>
                  <Icon size={21} />
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            </article>
          ))}
        </section>

        {/* Filter & Search Bar */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Goal filters">
              {FILTERS.map(({ label, value }) => {
                const count =
                  value === "All"
                    ? totalGoals
                    : value === "In Progress"
                    ? inProgressGoals
                    : completedGoals;

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
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                        active ? "bg-white/20 text-white" : "bg-white text-slate-700"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box */}
            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search goals..."
                aria-label="Search goals"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Goals Card Grid */}
        {visibleGoals.length > 0 ? (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleGoals.map((goal) => {
              const deadline = getDeadlineInfo(goal.targetDate, goal.status);
              const isCompleted = goal.status === "Completed";

              return (
                <article
                  key={goal.id}
                  className={`group relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                    isCompleted
                      ? "border-emerald-200/80 bg-gradient-to-b from-white to-emerald-50/20"
                      : "border-slate-200 hover:border-indigo-200"
                  }`}
                >
                  {/* Top Row: Status badge & Action buttons */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : "bg-indigo-50 text-indigo-700 ring-indigo-200"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 size={13} className="text-emerald-600" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock3 size={13} className="text-indigo-600" />
                            In Progress
                          </>
                        )}
                      </span>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleManualComplete(goal.id)}
                          title={isCompleted ? "Reopen goal" : "Mark as completed"}
                          aria-label={isCompleted ? "Reopen goal" : "Mark as completed"}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                            isCompleted
                              ? "text-emerald-600 hover:bg-emerald-100"
                              : "text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(goal)}
                          title="Edit goal"
                          aria-label={`Edit ${goal.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(goal.id)}
                          title="Delete goal"
                          aria-label={`Delete ${goal.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3
                      className={`mt-4 text-lg font-bold tracking-tight text-slate-900 ${
                        isCompleted ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {goal.title}
                    </h3>

                    {goal.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {goal.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs italic text-slate-400">
                        No description provided.
                      </p>
                    )}

                    {/* Target Date Badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} className="text-slate-400" />
                        {formatDate(goal.targetDate)}
                      </span>

                      {deadline && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${deadline.badgeClass}`}
                        >
                          {deadline.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Visual Progress Bar & Interactive Slider */}
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {/* Progress Info Header */}
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Progress</span>
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? "text-emerald-600" : "text-indigo-600"
                        }`}
                      >
                        {goal.progress}%
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div
                      className="h-3 w-full overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-valuenow={goal.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${goal.title} progress: ${goal.progress}%`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ease-out ${
                          isCompleted
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                            : "bg-gradient-to-r from-indigo-500 to-indigo-600"
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    {/* Interactive Slider */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <label htmlFor={`slider-${goal.id}`} className="font-medium text-slate-500">
                          Adjust Progress
                        </label>
                        <span>0% – 100%</span>
                      </div>
                      <input
                        id={`slider-${goal.id}`}
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={goal.progress}
                        onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                        aria-label={`Slider for ${goal.title}`}
                        className="h-2 w-full cursor-pointer accent-indigo-600 rounded-lg bg-slate-200"
                      />
                    </div>

                    {/* Quick Adjustment Controls */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickIncrement(goal.id, -10)}
                          disabled={goal.progress <= 0}
                          title="Decrease by 10%"
                          className="inline-flex min-h-8 items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          -10%
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickIncrement(goal.id, 10)}
                          disabled={goal.progress >= 100}
                          title="Quick increase by 10%"
                          className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus size={13} />
                          +10%
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleManualComplete(goal.id)}
                        className={`inline-flex min-h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                          isCompleted
                            ? "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <RotateCcw size={13} />
                            Reopen
                          </>
                        ) : (
                          <>
                            <Check size={13} />
                            Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          /* Empty State */
          <section className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Target size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {search ? "No matching goals found" : "No goals to display"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              {search
                ? `We couldn't find any goals matching "${search}". Try adjusting your keywords or filter.`
                : filter !== "All"
                ? `You have no goals categorized as "${filter}". Try switching filter tabs or create a new goal.`
                : "Start turning your aspirations into reality by defining your first goal."}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Clear Search
                </button>
              )}
              {filter === "All" && !search && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Plus size={18} />
                  Create Your First Goal
                </button>
              )}
            </div>
          </section>
        )}

        {/* Local Storage Indicator Footer */}
        <footer className="mt-10 border-t border-slate-200/80 pt-4 text-center text-xs text-slate-400">
          Showing {visibleGoals.length} of {totalGoals} goals · Saved locally in localStorage ('lifesync_goals')
        </footer>
      </div>

      {/* Modal: Create or Edit Goal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="goal-modal-heading"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">LifeSync / Goals</p>
                <h2 id="goal-modal-heading" className="mt-1 text-xl font-bold text-slate-900">
                  {editingId ? "Edit Goal" : "Create New Goal"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId
                    ? "Update your goal milestones and target deadline."
                    : "Define a personal goal and set your target date to stay accountable."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-5">
              {/* Goal Title */}
              <div>
                <label htmlFor="goal-title" className="mb-2 block text-sm font-semibold text-slate-800">
                  Goal Title *
                </label>
                <input
                  id="goal-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setError("");
                  }}
                  placeholder="e.g. Run a half marathon"
                  maxLength={160}
                  required
                  autoFocus
                  className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Goal Description */}
              <div>
                <label htmlFor="goal-description" className="mb-2 block text-sm font-semibold text-slate-800">
                  Description
                </label>
                <textarea
                  id="goal-description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your motivation, sub-goals, or action steps..."
                  maxLength={500}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Target Date */}
              <div>
                <label htmlFor="goal-target-date" className="mb-2 block text-sm font-semibold text-slate-800">
                  Target Date *
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="goal-target-date"
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => {
                      setForm({ ...form, targetDate: e.target.value });
                      setError("");
                    }}
                    required
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {/* Progress Slider (in Edit mode or optional on create) */}
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800">
                  <label htmlFor="goal-initial-progress">Progress</label>
                  <span className="font-bold text-indigo-600">{form.progress}%</span>
                </div>
                <input
                  id="goal-initial-progress"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                  className="h-2 w-full cursor-pointer accent-indigo-600 rounded-lg bg-slate-200"
                />
                <p className="mt-1 text-xs text-slate-400">
                  {form.progress === 100
                    ? "Setting progress to 100% will automatically mark this goal as Completed."
                    : "You can update this anytime using the card slider or +10% button."}
                </p>
              </div>

              {/* Error message */}
              {error && (
                <p role="alert" className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  <AlertCircle size={17} className="shrink-0" />
                  {error}
                </p>
              )}

              {/* Form Action Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  {editingId ? <Check size={17} /> : <Plus size={18} />}
                  {editingId ? "Save Changes" : "Create Goal"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-goal-heading"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={23} />
            </div>
            <h2 id="delete-goal-heading" className="mt-4 text-lg font-bold text-slate-900">
              Delete this goal?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {goalToDelete
                ? `"${goalToDelete.title}" will be permanently removed from your goals list.`
                : "This goal will be removed from your local goals list."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteGoal(deleteId)}
                className="min-h-11 flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
