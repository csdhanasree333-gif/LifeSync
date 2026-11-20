import { Routes, Route, Navigate, NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  ClipboardList,
  Zap,
  Smile,
} from "lucide-react";

import TaskManagement from "./modules/tasks/TaskManagement";
import MoodPage from "./modules/mood/MoodPage";
import RemindersPage from "./modules/reminders/index";

const NAV_ITEMS = [
  { to: "/tasks", label: "Tasks", Icon: ClipboardList },
  { to: "/reminders", label: "Reminders", Icon: Bell },
  { to: "/mood", label: "Mood Tracker", Icon: Smile },
];

function Layout() {
  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <span className="flex items-center gap-2 text-sm font-bold text-indigo-600">
            <Zap size={18} className="fill-indigo-600" />
            LifeSync
          </span>

          <div className="flex items-center gap-1">
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
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/tasks" replace />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/mood" element={<MoodPage />} />
      </Route>
    </Routes>
  );
}

export default App;