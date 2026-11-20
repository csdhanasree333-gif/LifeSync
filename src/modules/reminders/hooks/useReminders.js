import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "lifesync_reminders";

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function readReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (r) =>
        r &&
        typeof r.id === "string" &&
        typeof r.title === "string" &&
        typeof r.remindAt === "string" &&
        typeof r.isCompleted === "boolean"
    );
  } catch {
    return [];
  }
}

/**
 * Categorise a single reminder relative to `now`.
 *
 * "dueOrOverdue" – remindAt <= now (not completed)
 * "upcoming"     – remindAt > now  (not completed)
 * "completed"    – isCompleted === true
 */
export function categorise(reminder, now = new Date()) {
  if (reminder.isCompleted) return "completed";
  const at = new Date(reminder.remindAt);
  return at <= now ? "dueOrOverdue" : "upcoming";
}

export default function useReminders() {
  const [reminders, setReminders] = useState(readReminders);
  // Toast queue: array of { id, title } objects currently shown
  const [toasts, setToasts] = useState([]);
  // Track IDs we have already notified so we don't repeat
  const notifiedRef = useRef(new Set());

  // ── Persist to localStorage ──────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (err) {
      console.error("useReminders: unable to save to localStorage", err);
    }
  }, [reminders]);

  // ── Live tick: check for newly-due reminders every 30 s ─────────────────
  useEffect(() => {
    function tick() {
      const now = new Date();
      setReminders((prev) => {
        // Trigger toasts for newly-due non-completed reminders
        const newToasts = [];
        prev.forEach((r) => {
          if (
            !r.isCompleted &&
            new Date(r.remindAt) <= now &&
            !notifiedRef.current.has(r.id)
          ) {
            notifiedRef.current.add(r.id);
            newToasts.push({ id: r.id, title: r.title });
          }
        });
        if (newToasts.length) {
          setToasts((t) => [...t, ...newToasts]);
        }
        // Return the same array reference so React skips a re-render if
        // nothing actually changed about the reminders themselves – the
        // section components will re-derive categories from the new Date().
        return prev;
      });
    }

    tick(); // run once immediately
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // ── CRUD actions ─────────────────────────────────────────────────────────

  const addReminder = useCallback(({ title, description, remindAt }) => {
    const reminder = {
      id: createId(),
      title: title.trim(),
      description: (description || "").trim(),
      remindAt,          // ISO string
      isCompleted: false,
    };
    setReminders((prev) => [reminder, ...prev]);
    return reminder;
  }, []);

  const updateReminder = useCallback((id, patch) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              title: patch.title !== undefined ? patch.title.trim() : r.title,
              description:
                patch.description !== undefined
                  ? patch.description.trim()
                  : r.description,
              remindAt:
                patch.remindAt !== undefined ? patch.remindAt : r.remindAt,
            }
          : r
      )
    );
    // If the time changed, allow re-notification
    if (patch.remindAt !== undefined) {
      notifiedRef.current.delete(id);
    }
  }, []);

  const toggleComplete = useCallback((id) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
      )
    );
  }, []);

  const deleteReminder = useCallback((id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    notifiedRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    reminders,
    toasts,
    addReminder,
    updateReminder,
    toggleComplete,
    deleteReminder,
    dismissToast,
  };
}
