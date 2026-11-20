// ─── Storage ────────────────────────────────────────────────────────────────
export const STORAGE_KEY = "lifesync_habits";

export function readHabits() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (h) =>
        h &&
        typeof h.id === "string" &&
        typeof h.name === "string" &&
        ["daily", "weekly"].includes(h.frequency) &&
        Array.isArray(h.completedDates)
    );
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.error("Unable to save habits:", err);
  }
}

// ─── ID ─────────────────────────────────────────────────────────────────────
export function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

// ─── Date helpers ────────────────────────────────────────────────────────────
/** Returns today as 'YYYY-MM-DD' in local time */
export function todayStr() {
  const d = new Date();
  return toDateStr(d);
}

/** Converts a Date → 'YYYY-MM-DD' in local time */
export function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Returns array of last N days as 'YYYY-MM-DD' strings (oldest first) */
export function lastNDays(n) {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(toDateStr(d));
  }
  return days;
}

// ─── Streak calculation ───────────────────────────────────────────────────────
/**
 * Recalculates currentStreak and bestStreak for a habit.
 * - daily: each consecutive calendar day counts
 * - weekly: completed ≥1 time in each of the last consecutive ISO-weeks counts
 */
export function calcStreaks(habit) {
  const dateSet = new Set(habit.completedDates);

  if (habit.frequency === "daily") {
    return calcDailyStreaks(dateSet);
  }
  return calcWeeklyStreaks(habit.completedDates);
}

function calcDailyStreaks(dateSet) {
  if (dateSet.size === 0) return { currentStreak: 0, bestStreak: 0 };

  // Sort dates ascending
  const sorted = [...dateSet].sort();

  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const curr = new Date(sorted[i] + "T00:00:00");
    const diff = (curr - prev) / 86_400_000;
    if (diff === 1) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  // currentStreak: how many consecutive days ending on today or yesterday
  const today = todayStr();
  const yesterday = toDateStr(new Date(new Date().setDate(new Date().getDate() - 1)));

  let current = 0;
  if (dateSet.has(today) || dateSet.has(yesterday)) {
    const start = dateSet.has(today) ? today : yesterday;
    let check = new Date(start + "T00:00:00");
    while (dateSet.has(toDateStr(check))) {
      current++;
      check.setDate(check.getDate() - 1);
    }
  }

  return { currentStreak: current, bestStreak: Math.max(best, current) };
}

export function getISOWeekKey(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  // ISO week: set to Thursday of the same week
  const day = d.getDay() || 7; // 1=Mon … 7=Sun
  d.setDate(d.getDate() - day + 4);
  const jan4 = new Date(d.getFullYear(), 0, 4);
  const week = Math.ceil(((d - jan4) / 86_400_000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Returns true if any date in completedDates falls in the current ISO week.
 */
export function doneThisWeek(completedDates) {
  const thisWeek = getISOWeekKey(todayStr());
  return completedDates.some((d) => getISOWeekKey(d) === thisWeek);
}

/**
 * Returns an array of the last N ISO week keys (oldest first),
 * each as { key: 'YYYY-Wnn', label: 'Wn' } where label is relative
 * (W1 = oldest, W8 = current week).
 */
export function lastNWeeks(n) {
  const result = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);
    result.push({
      key:   getISOWeekKey(toDateStr(d)),
      label: `W${n - i}`,
    });
  }
  return result;
}

function calcWeeklyStreaks(completedDates) {
  if (!completedDates.length) return { currentStreak: 0, bestStreak: 0 };

  const weeks = new Set(completedDates.map(getISOWeekKey));
  const sorted = [...weeks].sort();

  // helper: week key → next week key
  function nextWeek(wk) {
    const [yr, w] = wk.split("-W").map(Number);
    // approx: add 7 days to Thursday of that week
    const jan4 = new Date(yr, 0, 4);
    const thu = new Date(jan4.getTime() + (w - 1) * 7 * 86_400_000);
    thu.setDate(thu.getDate() + 7);
    return getISOWeekKey(toDateStr(thu));
  }

  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (nextWeek(sorted[i - 1]) === sorted[i]) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  // current: consecutive weeks ending with the current or last week
  const thisWeek = getISOWeekKey(todayStr());
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const lastWeek = getISOWeekKey(toDateStr(lastWeekDate));

  let current = 0;
  if (weeks.has(thisWeek) || weeks.has(lastWeek)) {
    let checkDate = new Date();
    while (true) {
      const wk = getISOWeekKey(toDateStr(checkDate));
      if (!weeks.has(wk)) break;
      current++;
      checkDate.setDate(checkDate.getDate() - 7);
      // avoid infinite loop
      if (current > sorted.length) break;
    }
  }

  return { currentStreak: current, bestStreak: Math.max(best, current) };
}

