import { lastNDays, lastNWeeks, getISOWeekKey } from "./habitUtils";

/**
 * CompletionGrid
 *
 * Daily habits (frequency === 'daily'):
 *   days=7  → labeled 7-box row (Sun/Mon… labels + ✓)
 *   days=30 → 10-column mini square grid
 *
 * Weekly habits (frequency === 'weekly'):
 *   days=8  → 8-week row (W1…W8) where each box highlights if the habit
 *              was completed at least once during that ISO week.
 */
export default function CompletionGrid({
  completedDates,
  days = 7,
  frequency = "daily",
}) {
  if (frequency === "weekly") {
    return <WeeklyGrid completedDates={completedDates} weeks={days} />;
  }
  return <DailyGrid completedDates={completedDates} days={days} />;
}

/* ── Weekly 8-week grid ───────────────────────────────────────────────────── */
function WeeklyGrid({ completedDates, weeks = 8 }) {
  // Build a Set of ISO week keys that contain at least one completion
  const doneWeeks = new Set(completedDates.map(getISOWeekKey));
  const weekList  = lastNWeeks(weeks); // [{ key, label }, …] oldest→newest

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Last {weeks} Weeks
      </p>
      <div className="flex gap-2">
        {weekList.map(({ key, label }) => {
          const done = doneWeeks.has(key);
          const isCurrent = key === getISOWeekKey(
            new Date().toISOString().slice(0, 10)
          );
          return (
            <div key={key} className="flex flex-1 flex-col items-center gap-1">
              {/* Week box */}
              <div
                title={key}
                className={`relative flex h-9 w-full items-center justify-center rounded-xl border-2 transition-all ${
                  done
                    ? "border-amber-400 bg-amber-400 shadow-sm shadow-amber-200"
                    : isCurrent
                    ? "border-dashed border-amber-300 bg-amber-50"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                {done && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {/* Current-week dot */}
                {isCurrent && !done && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                )}
              </div>
              {/* Label */}
              <span
                className={`text-[10px] font-semibold ${
                  isCurrent ? "text-amber-500" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-2.5 flex items-center gap-3">
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-400" />
          Completed
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed border-amber-300 bg-amber-50" />
          This week
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-slate-200 bg-slate-100" />
          Missed
        </span>
      </div>
    </div>
  );
}

/* ── Daily grids ──────────────────────────────────────────────────────────── */
function DailyGrid({ completedDates, days }) {
  const dateSet = new Set(completedDates);
  const dayList = lastNDays(days);
  const show7   = days === 7;
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Last {days} days
      </p>

      {show7 ? (
        <div className="flex gap-1.5">
          {dayList.map((dateStr) => {
            const done = dateSet.has(dateStr);
            const dow  = new Date(dateStr + "T00:00:00").getDay();
            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-medium text-slate-400">
                  {DAY_LABELS[dow]}
                </span>
                <div
                  title={dateStr}
                  className={`h-7 w-7 rounded-lg border-2 transition-all ${
                    done
                      ? "border-violet-400 bg-violet-500 shadow-sm shadow-violet-200"
                      : "border-slate-200 bg-slate-100"
                  }`}
                >
                  {done && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-full w-full p-1"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 30-day grid: 10 columns */
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}
        >
          {dayList.map((dateStr) => {
            const done = dateSet.has(dateStr);
            return (
              <div
                key={dateStr}
                title={dateStr}
                className={`aspect-square rounded-md border transition-all ${
                  done
                    ? "border-violet-400 bg-violet-500"
                    : "border-slate-200 bg-slate-100"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
