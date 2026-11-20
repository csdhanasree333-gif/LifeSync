import { lastNDays } from "./habitUtils";

/**
 * Visual grid showing completion for the last N days.
 * completedDates: Set<string> of 'YYYY-MM-DD'
 * days: 7 or 30
 */
export default function CompletionGrid({ completedDates, days = 7 }) {
  const dateSet = new Set(completedDates);
  const dayList = lastNDays(days);

  // For 7-day view, show day-of-week labels; for 30-day, show week markers
  const show7 = days === 7;

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
            const dow = new Date(dateStr + "T00:00:00").getDay();
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
        /* 30-day grid: 5 rows × 6 cols */
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

