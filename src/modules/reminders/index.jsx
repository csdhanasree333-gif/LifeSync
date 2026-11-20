import {
  Bell,
  BellOff,
  CheckCircle2,
  Clock3,
  ListChecks,
  Plus,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import ReminderForm from "./components/ReminderForm";
import ReminderSection from "./components/ReminderSection";
import ToastBanner from "./components/ToastBanner";
import useReminders, { categorise } from "./hooks/useReminders";

export default function RemindersPage() {
  const {
    reminders,
    toasts,
    addReminder,
    updateReminder,
    toggleComplete,
    deleteReminder,
    dismissToast,
  } = useReminders();

  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null); // null = create mode
  const [confirmingId, setConfirmingId] = useState(null);

  // ── Derived lists (re-computed every render so the live timer is reflected) ──
  const { upcoming, dueOrOverdue, completed } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const dueOrOverdue = [];
    const completed = [];

    reminders.forEach((r) => {
      const cat = categorise(r, now);
      if (cat === "upcoming") upcoming.push(r);
      else if (cat === "dueOrOverdue") dueOrOverdue.push(r);
      else completed.push(r);
    });

    // Upcoming: soonest first
    upcoming.sort((a, b) => new Date(a.remindAt) - new Date(b.remindAt));
    // Due/Overdue: most-overdue first
    dueOrOverdue.sort((a, b) => new Date(a.remindAt) - new Date(b.remindAt));

    return { upcoming, dueOrOverdue, completed };
  }, [reminders]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingReminder(null);
    setShowForm(true);
  }

  function openEdit(reminder) {
    setEditingReminder(reminder);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingReminder(null);
  }

  function handleSave({ title, description, remindAt }) {
    if (editingReminder) {
      updateReminder(editingReminder.id, { title, description, remindAt });
    } else {
      addReminder({ title, description, remindAt });
    }
  }

  function handleDeleteRequest(id) {
    setConfirmingId(id);
  }

  function handleConfirmDelete(id) {
    deleteReminder(id);
    setConfirmingId(null);
  }

  function handleCancelDelete() {
    setConfirmingId(null);
  }

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = [
    {
      label: "Total",
      value: reminders.length,
      icon: ListChecks,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: Clock3,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Due / Overdue",
      value: dueOrOverdue.length,
      icon: TriangleAlert,
      color: "bg-rose-50 text-rose-600",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 text-slate-800 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* ── Page header ── */}
        <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Bell size={17} />
              LifeSync
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Reminders
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Never miss a moment — set reminders, get notified, stay on track.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
          >
            <Plus size={19} />
            New Reminder
          </button>
        </header>

        {/* ── Summary cards ── */}
        <section
          aria-label="Reminder statistics"
          className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, color }) => (
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

        {/* ── Sections ── */}
        <div className="flex flex-col gap-5">
          {/* Due Today / Overdue */}
          <ReminderSection
            title="Due Today / Overdue"
            icon={TriangleAlert}
            iconClass="text-rose-500"
            badgeClass="bg-rose-50 text-rose-700"
            emptyIcon={BellOff}
            emptyText="Nothing overdue — great job staying on top of things!"
            reminders={dueOrOverdue}
            variant="dueOrOverdue"
            confirmingId={confirmingId}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
            defaultOpen={true}
          />

          {/* Upcoming */}
          <ReminderSection
            title="Upcoming"
            icon={Clock3}
            iconClass="text-indigo-500"
            badgeClass="bg-indigo-50 text-indigo-700"
            emptyIcon={Bell}
            emptyText="No upcoming reminders. Add one to get started!"
            reminders={upcoming}
            variant="upcoming"
            confirmingId={confirmingId}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
            defaultOpen={true}
          />

          {/* Completed */}
          <ReminderSection
            title="Completed"
            icon={CheckCircle2}
            iconClass="text-emerald-500"
            badgeClass="bg-emerald-50 text-emerald-700"
            emptyIcon={ListChecks}
            emptyText="No completed reminders yet."
            reminders={completed}
            variant="completed"
            confirmingId={confirmingId}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={handleDeleteRequest}
            onConfirmDelete={handleConfirmDelete}
            onCancelDelete={handleCancelDelete}
            defaultOpen={false}
          />
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          {reminders.length} reminder{reminders.length === 1 ? "" : "s"} saved
          locally on this device
        </footer>
      </div>

      {/* ── Form modal ── */}
      {showForm && (
        <ReminderForm
          initial={editingReminder}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {/* ── Toast notifications ── */}
      <ToastBanner toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
