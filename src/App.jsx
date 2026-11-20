import { BrowserRouter, NavLink, Outlet, Route, Routes, Navigate } from "react-router-dom";
import { Bell, ClipboardList, Zap, CheckCircle2 } from "lucide-react";
import TaskManagement from "./modules/tasks/TaskManagement";
import RemindersPage from "./modules/reminders/index";
import HabitTracker from "./modules/habits/HabitTracker";


const NAV_ITEMS = [
  { to: "/tasks",     label: "Tasks",     Icon: ClipboardList },
  { to: "/reminders", label: "Reminders", Icon: Bell          },
  { to: "/habits", label: "Habits", Icon: CheckCircle2 },
];

function Layout() {
  return (
    <>
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          {/* Logo */}
          <span className="flex items-center gap-2 text-sm font-bold text-indigo-600">
            <Zap size={18} className="fill-indigo-600" />
            LifeSync
          </span>

          {/* Module tabs */}
          <div className="flex items-center gap-1" role="navigation" aria-label="Module navigation">
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
        </div>
      </nav>

      {/* ── Page content ── */}
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
  <Route path="/" element={<Navigate to="/tasks" replace />} />
  <Route path="/tasks" element={<TaskManagement />} />
  <Route path="/reminders" element={<RemindersPage />} />
  <Route path="/habits" element={<HabitTracker />} />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
