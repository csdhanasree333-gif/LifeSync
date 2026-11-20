import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  Pencil,
  Trash2,
  X,
  Flag,
  ClipboardList,
  Check,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "lifesync_tasks";
const PRIORITIES = ["Low", "Medium", "High"];

const FILTERS = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Completed", value: "Completed" },
];

const EMPTY_FORM = {
  title: "",
  priority: "Medium",
  deadline: "",
};

const priorityStyles = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-rose-50 text-rose-700 ring-rose-200",
};

function readTasks() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        PRIORITIES.includes(task.priority) &&
        typeof task.isCompleted === "boolean"
    );
  } catch {
    return [];
  }
}

function formatDate(value) {
  if (!value) return "No deadline";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDeadlineStatus(task) {
  if (!task.deadline || task.isCompleted) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(`${task.deadline}T00:00:00`);

  if (Number.isNaN(deadline.getTime())) return "";

  if (deadline < today) return "Overdue";
  if (deadline.getTime() === today.getTime()) return "Due today";

  return "";
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Unable to save tasks:", err);
    }
  }, [tasks]);

  const completed = tasks.filter((task) => task.isCompleted).length;
  const pending = tasks.length - completed;

  const overdue = tasks.filter(
    (task) => getDeadlineStatus(task) === "Overdue"
  ).length;

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.isCompleted) ||
      (filter === "Completed" && task.isCompleted);

    return (
      matchesFilter &&
      task.title.toLowerCase().includes(search.trim().toLowerCase())
    );
  });

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
    setShowForm(true);
  }

  function openEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      priority: task.priority,
      deadline: task.deadline || "",
    });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError("");
  }

  function saveTask(event) {
    event.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setError("Please enter a task title.");
      return;
    }

    if (!PRIORITIES.includes(form.priority)) {
      setError("Please select a valid priority.");
      return;
    }

    if (!form.deadline ||
        Number.isNaN(new Date(`${form.deadline}T00:00:00`).getTime())) {
      setError("Please select a valid deadline.");
      return;
    }

    if (editingId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? {
                ...task,
                title,
                priority: form.priority,
                deadline: form.deadline,
              }
            : task
        )
      );
    } else {
      setTasks((previous) => [
        {
          id: createId(),
          title,
          priority: form.priority,
          deadline: form.deadline,
          isCompleted: false,
          createdAt: new Date().toISOString(),
        },
        ...previous,
      ]);
    }

    closeForm();
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setDeleteId(null);
  }

  const summary = [
    {
      label: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: AlertCircle,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-800 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <ClipboardList size={17} />
              LifeSync 
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Task Management
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Organize your day, prioritize what matters, and track your progress.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            <Plus size={19} />
            Create Task
          </button>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map(({ label, value, icon: Icon, color }) => (
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

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Tasks</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {pending} task{pending === 1 ? "" : "s"} left to complete
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Task filters">
              {FILTERS.map(({ label, value }) => {
                const count =
                  value === "All" ? tasks.length :
                  value === "Pending" ? pending : completed;

                const active = filter === value;

                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(value)}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                      active
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                    <span className={`rounded-md px-1.5 py-0.5 text-xs ${
                      active ? "bg-white/20" : "bg-white"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {visibleTasks.length ? visibleTasks.map((task) => {
              const dateStatus = getDeadlineStatus(task);

              return (
                <article
                  key={task.id}
                  className="flex gap-3 p-4 transition hover:bg-slate-50 sm:gap-4 sm:p-5"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={task.isCompleted ? "Mark as pending" : "Mark as completed"}
                    className="mt-1 shrink-0 text-slate-300 hover:text-indigo-600"
                  >
                    {task.isCompleted
                      ? <CheckCircle2 size={23} className="text-emerald-500" />
                      : <Circle size={23} />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h3 className={`break-words text-sm font-semibold sm:text-base ${
                      task.isCompleted ? "text-slate-400 line-through" : "text-slate-800"
                    }`}>
                      {task.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${priorityStyles[task.priority]}`}>
                        <Flag size={12} />
                        {task.priority} Priority
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {formatDate(task.deadline)}
                      </span>

                      {dateStatus && (
                        <span className={`text-xs font-semibold ${
                          dateStatus === "Overdue" ? "text-rose-600" : "text-amber-600"
                        }`}>
                          {dateStatus}
                        </span>
                      )}

                      {task.isCompleted && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-start gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(task)}
                      aria-label={`Edit ${task.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(task.id)}
                      aria-label={`Delete ${task.title}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            }) : (
              <div className="px-5 py-16 text-center">
                <ClipboardList size={30} className="mx-auto text-indigo-400" />
                <h3 className="mt-4 font-bold text-slate-800">
                  {search ? "No matching tasks" : "No tasks to display"}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create a task to start organizing your day.
                </p>
                {filter === "All" && !search && (
                  <button
                    type="button"
                    onClick={openCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Plus size={17} />
                    Create your first task
                  </button>
                )}
              </div>
            )}
          </div>

          <footer className="border-t border-slate-100 bg-slate-50/70 px-4 py-4 text-xs text-slate-500 sm:px-6">
            Showing {visibleTasks.length} of {tasks.length} tasks · Saved locally on this device
          </footer>
        </section>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-heading"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-600">LifeSync / Tasks</p>
                <h2 id="task-form-heading" className="mt-1 text-xl font-bold text-slate-900">
                  {editingId ? "Edit Task" : "Create New Task"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add the details to organize your day.
                </p>
              </div>
              <button type="button" onClick={closeForm} aria-label="Close form" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveTask} className="space-y-5">
              <div>
                <label htmlFor="task-title" className="mb-2 block text-sm font-semibold">
                  Task title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => {
                    setForm({ ...form, title: event.target.value });
                    setError("");
                  }}
                  placeholder="e.g. Complete project report"
                  maxLength={200}
                  required
                  autoFocus
                  className="min-h-12 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Priority *</legend>
                <div className="grid grid-cols-3 gap-2">
                  {PRIORITIES.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      aria-pressed={form.priority === priority}
                      onClick={() => setForm({ ...form, priority })}
                      className={`min-h-11 rounded-xl border px-2 py-2 text-sm font-semibold ${
                        form.priority === priority
                          ? `${priorityStyles[priority]} border-current`
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="task-deadline" className="mb-2 block text-sm font-semibold">
                  Deadline *
                </label>
                <div className="relative">
                  <CalendarDays size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="task-deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(event) => {
                      setForm({ ...form, deadline: event.target.value });
                      setError("");
                    }}
                    required
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle size={17} />
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                  {editingId ? <Check size={17} /> : <Plus size={18} />}
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-heading"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 size={23} />
            </div>
            <h2 id="delete-heading" className="mt-4 text-lg font-bold text-slate-900">
              Delete this task?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This task will be removed from your local task list.
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={() => deleteTask(deleteId)} className="min-h-11 flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}