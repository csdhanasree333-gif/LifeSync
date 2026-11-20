import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  SmilePlus,
  ClipboardList,
  CalendarDays,
  Zap,
} from "lucide-react";

/* ── Fake UI mockup data ───────────────────────────────────────────────── */
const MOCK_TASKS = [
  { label: "Review project roadmap", done: true },
  { label: "Morning meditation", done: true },
  { label: "Read 20 pages", done: false },
  { label: "Team standup at 10 AM", done: false },
];

const MOCK_HABITS = [
  { name: "Exercise", streak: 12, days: [1, 1, 1, 1, 0, 1, 1] },
  { name: "Journaling", streak: 7, days: [1, 0, 1, 1, 1, 1, 1] },
  { name: "Water Intake", streak: 5, days: [1, 1, 1, 0, 0, 1, 1] },
];

const MOOD_DATA = [
  { day: "Mon", score: 4 },
  { day: "Tue", score: 5 },
  { day: "Wed", score: 3 },
  { day: "Thu", score: 5 },
  { day: "Fri", score: 4 },
  { day: "Sat", score: 5 },
  { day: "Sun", score: 4 },
];

const MAX_MOOD = 5;

function MoodBar({ score }) {
  const pct = (score / MAX_MOOD) * 100;
  const color =
    score >= 4
      ? "bg-emerald-400"
      : score === 3
      ? "bg-amber-400"
      : "bg-rose-400";
  return (
    <div className="flex h-20 w-full items-end">
      <div
        className={`w-full rounded-t-md ${color} transition-all`}
        style={{ height: `${pct}%` }}
      />
    </div>
  );
}

/* ── Main mockup card ──────────────────────────────────────────────────── */
function MockupCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white/70 p-5 shadow-2xl shadow-indigo-100 backdrop-blur-xl ring-1 ring-white/50">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold text-indigo-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Zap size={12} className="fill-white" />
          </span>
          LifeSync
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
          Today
        </span>
      </div>

      {/* Tasks */}
      <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
          <ClipboardList size={12} /> Tasks
        </p>
        <div className="space-y-2">
          {MOCK_TASKS.map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              {t.done ? (
                <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
              ) : (
                <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-slate-300" />
              )}
              <span
                className={`text-xs ${
                  t.done
                    ? "text-slate-400 line-through"
                    : "font-medium text-slate-700"
                }`}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Habits */}
      <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
          <Flame size={12} className="text-orange-500" /> Habit Streaks
        </p>
        <div className="space-y-2.5">
          {MOCK_HABITS.map((h) => (
            <div key={h.name}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  {h.name}
                </span>
                <span className="flex items-center gap-0.5 text-xs font-bold text-orange-500">
                  <Flame size={10} />
                  {h.streak}d
                </span>
              </div>
              <div className="flex gap-1">
                {h.days.map((done, i) => (
                  <div
                    key={i}
                    className={`h-3 flex-1 rounded-sm ${
                      done ? "bg-violet-400" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
          <SmilePlus size={12} className="text-pink-500" /> Mood This Week
        </p>
        <div className="flex items-end gap-1" style={{ height: 48 }}>
          {MOOD_DATA.map(({ day, score }) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-0.5">
              <MoodBar score={score} />
              <span className="text-[9px] text-slate-400">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -right-4 -top-3 flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-200">
        <CalendarDays size={12} />
        All in one place
      </div>
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────────────────── */
export default function HeroSection({ isLoggedIn }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0"
      >
        <div className="h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left — text */}
          <div className="max-w-xl">
            {/* Pill badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Your all-in-one life management system
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Organize Your Life,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                One Day at a Time.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Stop juggling scattered apps. LifeSync brings your tasks, habits,
              mood, goals, journal, reminders, and analytics into{" "}
              <span className="font-semibold text-slate-800">
                one unified workspace
              </span>{" "}
              — so you can focus on what actually matters.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {isLoggedIn ? (
                <Link
                  to="/tasks"
                  className="inline-flex h-13 items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:-translate-y-0.5"
                >
                  Go to Dashboard
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth?mode=register"
                    className="inline-flex h-13 items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:-translate-y-0.5"
                  >
                    Start Free
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/auth"
                    className="inline-flex h-13 items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-7 py-3.5 text-base font-bold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5"
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
              {[
                "No credit card required",
                "100% offline-first",
                "Open source",
              ].map((txt) => (
                <span key={txt} className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  {txt}
                </span>
              ))}
            </div>
          </div>

          {/* Right — mockup */}
          <div className="flex justify-center lg:justify-end">
            <MockupCard />
          </div>
        </div>
      </div>
    </section>
  );
}
