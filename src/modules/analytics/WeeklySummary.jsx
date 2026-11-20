
import React from "react";
import {
  TrendingUp,
  CheckCircle2,
  Target,
  Heart,
  Sparkles,
} from "lucide-react";

import {
  getAnalyticsData,
  getAverageGoalProgress,
  getHabitConsistency,
  getMostFrequentMood,
} from "./AnalyticsUtils";

// Check whether a record belongs to the last 7 days
const isWithinLastSevenDays = (record) => {
  const dateValue =
    record.completedAt ||
    record.updatedAt ||
    record.createdAt ||
    record.date ||
    record.timestamp;

  if (!dateValue) return false;

  const recordDate = new Date(dateValue);

  if (Number.isNaN(recordDate.getTime())) return false;

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return recordDate >= sevenDaysAgo && recordDate <= now;
};

const isCompleted = (task) =>
  task.completed === true ||
  task.status?.toLowerCase() === "completed";

export default function WeeklySummary() {
  const { tasks, goals, habits, moods } = getAnalyticsData();

  const weeklyTasks = tasks.filter(
    (task) => isCompleted(task) && isWithinLastSevenDays(task)
  );

  const weeklyMoods = moods.filter(isWithinLastSevenDays);

  const goalProgress = getAverageGoalProgress(goals);
  const habitConsistency = getHabitConsistency(habits);

  const frequentMood = getMostFrequentMood(
    weeklyMoods.length ? weeklyMoods : moods
  );

  const summaryMessage =
    weeklyTasks.length > 0
      ? `Great work! You completed ${weeklyTasks.length} task(s) this week. Keep building your momentum!`
      : "A new week is a fresh opportunity. Start completing your tasks and building positive habits!";

  const summaryItems = [
    {
      title: "Tasks Completed",
      value: weeklyTasks.length,
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Goal Progress",
      value: `${goalProgress}%`,
      icon: Target,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Habit Consistency",
      value: `${habitConsistency}%`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Frequent Mood",
      value: frequentMood,
      icon: Heart,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 rounded-xl bg-indigo-50">
          <Sparkles className="text-indigo-600" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Weekly Progress Summary
          </h2>
          <p className="text-sm text-gray-500">
            Your progress across all LifeSync modules
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {item.title}
                </span>

                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <Icon className={item.color} size={19} />
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-3">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-indigo-50 flex gap-3">
        <Sparkles
          className="text-indigo-600 shrink-0 mt-1"
          size={20}
        />

        <div>
          <h3 className="font-semibold text-indigo-900">
            Your Weekly Insight
          </h3>

          <p className="text-sm text-indigo-800 mt-1">
            {summaryMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
