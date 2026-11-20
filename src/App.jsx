import { BrowserRouter, NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { Bell, ClipboardList, Zap, CheckCircle2, BarChart3, LogOut, User } from "lucide-react";

import TaskManagement  from "./modules/tasks/TaskManagement";
import RemindersPage   from "./modules/reminders/index";
import HabitTracker    from "./modules/habits/HabitTracker";
import Analytics       from "./modules/analytics/Analytics";
import LandingPage     from "./pages/landing/LandingPage";
import AuthPage        from "./pages/auth/AuthPage";
import { readSession, clearSession } from "./pages/auth/authUtils";

const NAV_ITEMS = [
  { to: "/tasks",     label: "Tasks",     Icon: ClipboardList },
  { to: "/reminders", label: "Reminders", Icon: Bell          },
  { to: "/habits",    label: "Habits",    Icon: CheckCircle2  },
  { to: "/analytics", label: "Analytics", Icon: BarChart3     },
];

function Layout() {
  const navigate = useNavigate();
  const session  = readSession();

  function handleLogout() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          {/* Logo */}
          <span className="flex items-center gap-2 text-sm font-bold text-indigo-600">
            <Zap size={18} className="fill-indigo-600" />
            LifeSync
          </span>

          {/* Module links */}
          <div
            className="flex items-center gap-1"
            role="navigation"
            aria-label="Module navigation"
          >
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex min-h-9 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-2">
            {session && (
              <span className="hidden items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:flex">
                <User size={13} />
                {session.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes (no Layout) ── */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/auth"  element={<AuthPage />}    />
        <Route path="/login" element={<AuthPage />}    />

        {/* ── App routes (with Layout nav) ── */}
        <Route element={<Layout />}>
          <Route path="/tasks"     element={<TaskManagement />} />
          <Route path="/reminders" element={<RemindersPage />}  />
          <Route path="/habits"    element={<HabitTracker />}   />
          <Route path="/dashboard" element={<Analytics />}      />
          <Route path="/analytics" element={<Analytics />}      />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
