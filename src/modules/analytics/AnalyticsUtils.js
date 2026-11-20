
// ========================================
// LifeSync - Module 8
// Analytics Utility Functions
// ========================================

// Read data safely from localStorage
export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    const parsedData = data ? JSON.parse(data) : [];

    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

// Get all module data
export const getAnalyticsData = () => ({
  tasks: getStorageData("lifesync_tasks"),
  goals: getStorageData("lifesync_goals"),
  habits: getStorageData("lifesync_habits"),
  moods: getStorageData("lifesync_moods"),
});

// Calculate completed tasks
export const getCompletedTasks = (tasks) => {
  return tasks.filter(
    (task) =>
      task.completed === true ||
      task.status?.toLowerCase() === "completed"
  ).length;
};

// Calculate average goal progress
export const getAverageGoalProgress = (goals) => {
  if (!goals.length) return 0;

  const total = goals.reduce((sum, goal) => {
    const progress = Number(goal.progress) || 0;
    return sum + Math.min(100, Math.max(0, progress));
  }, 0);

  return Math.round(total / goals.length);
};

// Calculate habit consistency
export const getHabitConsistency = (habits) => {
  if (!habits.length) return 0;

  const completed = habits.filter(
    (habit) =>
      habit.completed === true ||
      habit.status?.toLowerCase() === "completed"
  ).length;

  return Math.round((completed / habits.length) * 100);
};

// Find most frequent mood
export const getMostFrequentMood = (moods) => {
  if (!moods.length) return "No mood data";

  const moodCounts = {};

  moods.forEach((item) => {
    const mood = item.mood;

    if (mood) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
  });

  const sortedMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1]);

  return sortedMoods[0]?.[0] || "No mood data";
};

// Get all KPI values
export const getKPIData = () => {
  const { tasks, goals, habits, moods } = getAnalyticsData();

  return {
    completedTasks: getCompletedTasks(tasks),
    goalProgress: getAverageGoalProgress(goals),
    habitConsistency: getHabitConsistency(habits),
    frequentMood: getMostFrequentMood(moods),
  };
};
