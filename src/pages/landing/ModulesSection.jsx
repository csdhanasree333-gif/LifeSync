import {
  Target,
  CheckCircle2,
  ClipboardList,
  CalendarDays,
  BookOpen,
  SmilePlus,
  Bell,
  BarChart3,
} from "lucide-react";

const MODULES = [
  {
    icon: Target,
    name: "Goal Management",
    desc: "Set ambitious goals, break them into milestones, and celebrate every win.",
    accent: "bg-indigo-50 text-indigo-600",
    ring: "ring-indigo-100",
  },
  {
    icon: CheckCircle2,
    name: "Habit Tracker",
    desc: "Build powerful routines with streaks, 7-day and 30-day history grids.",
    accent: "bg-violet-50 text-violet-600",
    ring: "ring-violet-100",
  },
  {
    icon: ClipboardList,
    name: "Task Management",
    desc: "Organize tasks by priority and deadline. Never let anything slip through.",
    accent: "bg-blue-50 text-blue-600",
    ring: "ring-blue-100",
  },
  {
    icon: CalendarDays,
    name: "Calendar",
    desc: "Visualize your week at a glance. Schedule events and block focus time.",
    accent: "bg-sky-50 text-sky-600",
    ring: "ring-sky-100",
  },
  {
    icon: BookOpen,
    name: "Digital Journal",
    desc: "Capture daily thoughts, reflections, and gratitude in a private journal.",
    accent: "bg-amber-50 text-amber-600",
    ring: "ring-amber-100",
  },
  {
    icon: SmilePlus,
    name: "Mood Tracker",
    desc: "Log how you feel daily and spot emotional patterns over time.",
    accent: "bg-pink-50 text-pink-600",
    ring: "ring-pink-100",
  },
  {
    icon: Bell,
    name: "Reminders",
    desc: "Smart reminders that keep you on track without overwhelming you.",
    accent: "bg-orange-50 text-orange-600",
    ring: "ring-orange-100",
  },
  {
    icon: BarChart3,
    name: "Analytics",
    desc: "Understand your productivity trends through beautiful visual reports.",
    accent: "bg-emerald-50 text-emerald-600",
    ring: "ring-emerald-100",
  },
];

export default function ModulesSection() {
  return (
    <section
      id="modules"
      className="relative bg-white py-20 sm:py-28"
    >
      {/* Subtle grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-30"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600">
            8 Modules
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
            LifeSync covers every dimension of personal productivity and
            wellness — purpose-built to work together seamlessly.
          </p>
        </div>

        {/* 4×2 Grid */}
        <div
          id="features"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MODULES.map(({ icon: Icon, name, desc, accent, ring }) => (
            <article
              key={name}
              className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ${ring} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-100`}
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-white to-slate-50 opacity-0 transition group-hover:opacity-100"
              />

              <span
                className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={22} />
              </span>

              <h3 className="relative mb-2 text-base font-bold text-slate-800">
                {name}
              </h3>
              <p className="relative text-sm leading-relaxed text-slate-500">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
