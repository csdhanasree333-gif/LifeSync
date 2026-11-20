import { Link } from "react-router-dom";
import { Zap, Code2 } from "lucide-react";

const TEAM = [
  "Nivin Murali",
  "Member 2",
  "Member 3",
  "Member 4",
  "Member 5",
  "Member 6",
  "Member 7",
  "Member 8",
];

const QUICK_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Modules", href: "#modules" },
];

const APP_LINKS = [
  { label: "Task Manager", to: "/tasks" },
  { label: "Habit Tracker", to: "/habits" },
  { label: "Reminders", to: "/reminders" },
  { label: "Analytics", to: "/analytics" },
];

export default function LandingFooter() {
  function handleAnchor(e, href) {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="mb-4 flex items-center gap-2 text-lg font-extrabold text-indigo-600"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Zap size={16} className="fill-white" />
              </span>
              LifeSync
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Your all-in-one personal life management system. Organize tasks,
              build habits, and track wellness — all offline.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-700">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => handleAnchor(e, href)}
                    className="text-sm text-slate-500 transition hover:text-indigo-600"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* App links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-700">
              App Modules
            </h3>
            <ul className="space-y-2.5">
              {APP_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-slate-500 transition hover:text-indigo-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Team */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-700">
              Our 8-Member Team
            </h3>
            <ul className="space-y-2">
              {TEAM.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 text-sm text-slate-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} LifeSync. Built with ❤️ by an 8-member
            team. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-700"
            >
              <Code2 size={16} />
                GitHub
            </a>
            <span className="text-xs text-slate-300">|</span>
            <span className="text-xs text-slate-400">
              Agile Project · 2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
