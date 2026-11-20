import { UserPlus, CalendarCheck, TrendingUp, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Sign up in seconds — no credit card needed. Your data lives locally on your device.",
    color: "bg-indigo-600",
    glow: "shadow-indigo-200",
    ring: "ring-indigo-100",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Plan & Track Daily Activities",
    desc: "Add tasks, build habits, log your mood, and journal — all from one unified dashboard.",
    color: "bg-violet-600",
    glow: "shadow-violet-200",
    ring: "ring-violet-100",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Analyze Your Progress",
    desc: "Review weekly summaries, spot trends, and continuously level up your productivity.",
    color: "bg-emerald-600",
    glow: "shadow-emerald-200",
    ring: "ring-emerald-100",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full bg-violet-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-600">
            How It Works
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Up and Running in{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            LifeSync is designed to get out of your way. No complex setup — just
            open, plan, and go.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[16.666%] right-[16.666%] top-10 hidden h-0.5 bg-gradient-to-r from-indigo-200 via-violet-200 to-emerald-200 md:block"
          />

          {STEPS.map(({ step, icon: Icon, title, desc, color, glow, ring }, i) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              {/* Arrow between steps (mobile) */}
              {i < STEPS.length - 1 && (
                <div className="mb-4 flex justify-center md:hidden">
                  <ArrowRight size={20} className="text-slate-300" />
                </div>
              )}

              {/* Icon circle */}
              <div
                className={`relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${color} shadow-xl ${glow} ring-4 ring-white`}
              >
                <Icon size={32} className="text-white" />
                {/* Step number badge */}
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-200">
                  {step}
                </span>
              </div>

              {/* Card */}
              <div
                className={`w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ${ring} transition hover:-translate-y-1 hover:shadow-md`}
              >
                <h3 className="mb-3 text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
