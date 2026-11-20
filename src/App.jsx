
import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  Bell,
  ClipboardList,
  Zap,
  Smile,
  BarChart3,
  CheckCircle2,
  Target,
  Menu,
  X,
  CalendarDays,
  BookOpen,
} from "lucide-react";

import TaskManagement from "./modules/tasks/TaskManagement";
import Journal from "./modules/journal/Journal";
import GoalManagement from "./modules/goals/GoalManagement";
import MoodPage from "./modules/mood/MoodPage";
import RemindersPage from "./modules/reminders/index";
import HabitTracker from "./modules/habits/HabitTracker";
import Analytics from "./modules/analytics/Analytics";
import Calendar from "./modules/Calendar/Calendar";

import "./App.css";

const NAV_ITEMS = [
  { to: "/tasks", label: "Tasks", Icon: ClipboardList },
  { to: "/calendar", label: "Calendar", Icon: CalendarDays },
  { to: "/journal", label: "Journal", Icon: BookOpen },
  { to: "/goals", label: "Goals", Icon: Target },
  { to: "/reminders", label: "Reminders", Icon: Bell },
  { to: "/mood", label: "Mood Tracker", Icon: Smile },
  { to: "/habits", label: "Habits", Icon: CheckCircle2 },
  { to: "/analytics", label: "Analytics", Icon: BarChart3 },
];

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentNav = NAV_ITEMS.find((item) =>
    location.pathname.startsWith(item.to)
  );

  return (
    <div className="app-container flex min-h-screen w-full flex-col bg-slate-50 text-slate-800 md:flex-row">

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm md:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Zap size={18} className="fill-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            LifeSync
          </span>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav
            className="flex w-full flex-col gap-1.5 border-b border-slate-200 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Desktop & Tablet Sidebar */}
      <aside className="sidebar sticky top-0 hidden h-screen flex-col border-r border-slate-200 bg-white md:flex">

        {/* Brand Header */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-100 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Zap size={18} className="fill-white" />
          </span>

          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              LifeSync
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Personal Management
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav
          className="flex-1 space-y-1.5 overflow-y-auto p-4"
          aria-label="Sidebar navigation"
        >
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              Active Module
            </p>
            <p className="mt-0.5 font-medium text-indigo-600">
              {currentNav?.label || "Overview"}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/goals" element={<GoalManagement />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/mood" element={<MoodPage />} />
        <Route path="/habits" element={<HabitTracker />} />

        <Route
          path="/dashboard"
          element={<Navigate to="/analytics" replace />}
        />

        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

export default App;