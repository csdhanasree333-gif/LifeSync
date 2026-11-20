
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

import {
  CheckCircle2, Target, TrendingUp, Heart,
  BarChart3, RefreshCw, Sparkles, CalendarDays
} from "lucide-react";

import {
  getAnalyticsData,
  getKPIData
} from "./AnalyticsUtils";

import WeeklySummary from "./WeeklySummary";
import "./Analytics.css";

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#8b5cf6"];

const DEMO_DATA = {
  lifesync_tasks: [
    { id: 1, title: "Complete assignment", status: "completed", completed: true, completedAt: "2026-11-18" },
    { id: 2, title: "Study React", status: "completed", completed: true, completedAt: "2026-11-17" },
    { id: 3, title: "Exercise", status: "completed", completed: true, completedAt: "2026-11-16" },
    { id: 4, title: "Read a book", status: "completed", completed: true, completedAt: "2026-11-12" },
    { id: 5, title: "Project work", status: "completed", completed: true, completedAt: "2026-10-25" },
    { id: 6, title: "Learn JavaScript", status: "completed", completed: true, completedAt: "2026-10-20" },
    { id: 7, title: "Practice SQL", status: "completed", completed: true, completedAt: "2026-09-15" },
    { id: 8, title: "Complete notes", status: "pending", completed: false, createdAt: "2026-11-18" },
    { id: 9, title: "Watch tutorial", status: "completed", completed: true, completedAt: "2026-09-10" },
    { id: 10, title: "Prepare presentation", status: "completed", completed: true, completedAt: "2026-08-15" }
  ],

  lifesync_goals: [
    { id: 1, title: "Learn React", progress: 80 },
    { id: 2, title: "Fitness Goal", progress: 65 },
    { id: 3, title: "Read 12 Books", progress: 90 },
    { id: 4, title: "Improve Skills", progress: 70 }
  ],

  lifesync_habits: [
    { id: 1, title: "Exercise", completed: true },
    { id: 2, title: "Reading", completed: true },
    { id: 3, title: "Drink Water", completed: true },
    { id: 4, title: "Meditation", completed: false },
    { id: 5, title: "Study", completed: true }
  ],

  lifesync_moods: [
    { id: 1, mood: "Happy", date: "2026-11-19" },
    { id: 2, mood: "Happy", date: "2026-11-18" },
    { id: 3, mood: "Calm", date: "2026-11-17" },
    { id: 4, mood: "Happy", date: "2026-11-16" },
    { id: 5, mood: "Sad", date: "2026-11-15" },
    { id: 6, mood: "Excited", date: "2026-11-14" },
    { id: 7, mood: "Calm", date: "2026-11-13" },
    { id: 8, mood: "Happy", date: "2026-11-12" }
  ]
};

const getDate = (task) => {
  const value =
    task.completedAt || task.updatedAt ||
    task.createdAt || task.date || task.timestamp;

  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildMonthlyData = (tasks) => {
  const now = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1
    );

    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const count = tasks.filter((task) => {
      const date = getDate(task);
      return (
        date &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        (task.completed === true ||
          task.status?.toLowerCase() === "completed")
      );
    }).length;

    return {
      month: monthDate.toLocaleString("en-US", { month: "short" }),
      tasks: count
    };
  });
};

const buildMoodData = (moods) => {
  const counts = {};

  moods.forEach((item) => {
    if (item.mood) {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    }
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value
  }));
};

function Analytics() {
  const [refresh, setRefresh] = useState(0);
  const [notice, setNotice] = useState("");

  const data = getAnalyticsData();
  const kpis = getKPIData();

  const monthlyData = buildMonthlyData(data.tasks);
  const moodData = buildMoodData(data.moods);

  const completedTasks = kpis.completedTasks;
  const goalProgress = kpis.goalProgress;
  const habitConsistency = kpis.habitConsistency;
  const frequentMood = kpis.frequentMood;

  const loadDemoData = () => {
    Object.entries(DEMO_DATA).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    setRefresh((prev) => prev + 1);
    setNotice("Sample demo data loaded successfully!");
  };

  const refreshData = () => {
    setRefresh((prev) => prev + 1);
    setNotice("Analytics data refreshed!");
  };

  const kpiCards = [
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: CheckCircle2,
      color: "blue",
      subtitle: "Total completed tasks"
    },
    {
      title: "Goal Progress",
      value: `${goalProgress}%`,
      icon: Target,
      color: "green",
      subtitle: "Average goal completion"
    },
    {
      title: "Habit Consistency",
      value: `${habitConsistency}%`,
      icon: TrendingUp,
      color: "purple",
      subtitle: "Completed habits"
    },
    {
      title: "Most Frequent Mood",
      value: frequentMood,
      icon: Heart,
      color: "pink",
      subtitle: "Your common mood"
    }
  ];

  return (
    <main className="analytics-page min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <BarChart3 size={22} />
            <span className="font-semibold text-sm">LIFESYNC ANALYTICS</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Analytics & Progress Reports
          </h1>

          <p className="text-slate-500 mt-2">
            Track your productivity, goals, habits and emotional wellness.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            onClick={loadDemoData}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            <Sparkles size={17} />
            Load Sample Demo Data
          </button>
        </div>
      </header>

      {notice && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
          {notice}
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center">
                <div className={`kpi-icon ${card.color}`}>
                  <Icon size={23} />
                </div>
                <span className="text-xs text-slate-400">LifeSync</span>
              </div>

              <h3 className="text-sm text-slate-500 mt-5">
                {card.title}
              </h3>

              <p className="text-2xl font-bold text-slate-800 mt-2">
                {card.value}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* Productivity Chart */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CalendarDays size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Monthly Productivity
              </h2>
              <p className="text-xs text-slate-400">
                Completed tasks over the last 6 months
              </p>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="tasks"
                  name="Completed Tasks"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Heart size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">
                Mood Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Overview of your recorded moods
              </p>
            </div>
          </div>

          {moodData.length > 0 ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label
                  >
                    {moodData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-400">
              No mood data available. Load sample data to view chart.
            </div>
          )}
        </div>
      </section>

      {/* Weekly Summary */}
      <section className="mb-8">
        <WeeklySummary key={refresh} />
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-slate-400 py-5">
        <p>LifeSync Analytics • Your progress, your journey.</p>
      </footer>

    </main>
  );
}

export default Analytics;
