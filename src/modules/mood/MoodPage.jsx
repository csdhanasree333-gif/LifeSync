import React, { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Trash2,
  Pencil,
  Save,
  X,
  Heart,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ===============================
// MOOD OPTIONS
// ===============================

const moods = [
  {
    moodLabel: "Happy",
    emoji: "😄",
    score: 5,
    color: "#22c55e",
  },
  {
    moodLabel: "Calm",
    emoji: "😌",
    score: 4,
    color: "#38bdf8",
  },
  {
    moodLabel: "Neutral",
    emoji: "😐",
    score: 3,
    color: "#a78bfa",
  },
  {
    moodLabel: "Stressed",
    emoji: "😫",
    score: 2,
    color: "#f59e0b",
  },
  {
    moodLabel: "Sad",
    emoji: "😢",
    score: 1,
    color: "#f87171",
  },
];

const STORAGE_KEY = "lifesync_moods";

// ===============================
// GET TODAY'S DATE
// ===============================

function getToday() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return [year, month, day].join("-");
}

// ===============================
// READ LOCAL STORAGE
// ===============================

function readMoods() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading moods:", error);
    return [];
  }
}

// ===============================
// MAIN COMPONENT
// ===============================

export default function MoodPage() {
  const [moodLogs, setMoodLogs] = useState(readMoods);

  const [selectedMood, setSelectedMood] = useState(null);

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [note, setNote] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ===============================
  // SAVE DATA TO LOCAL STORAGE
  // ===============================

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(moodLogs)
    );
  }, [moodLogs]);

  // ===============================
  // RESET FORM
  // ===============================

  function resetForm() {
    setSelectedMood(null);
    setSelectedDate(getToday());
    setNote("");
    setEditingId(null);
  }

  // ===============================
  // SAVE MOOD
  // ===============================

  function handleSaveMood() {
    if (!selectedMood) {
      alert("Please select your mood first!");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    const newEntry = {
      id: editingId || (
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`
      ),

      moodLabel: selectedMood.moodLabel,

      emoji: selectedMood.emoji,

      score: selectedMood.score,

      note: note.trim(),

      date: selectedDate,
    };

    setMoodLogs((previous) => {
      // Update existing entry
      if (editingId) {
        return previous.map((item) =>
          item.id === editingId ? newEntry : item
        );
      }

      // One entry per date
      const existingEntry = previous.find(
        (item) => item.date === selectedDate
      );

      if (existingEntry) {
        return previous.map((item) =>
          item.date === selectedDate
            ? {
                ...newEntry,
                id: existingEntry.id,
              }
            : item
        );
      }

      // Add new entry
      return [...previous, newEntry];
    });

    resetForm();
  }

  // ===============================
  // EDIT MOOD
  // ===============================

  function handleEdit(entry) {
    const mood = moods.find(
      (item) => item.moodLabel === entry.moodLabel
    );

    setSelectedMood(mood);

    setSelectedDate(entry.date);

    setNote(entry.note || "");

    setEditingId(entry.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ===============================
  // DELETE MOOD
  // ===============================

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mood entry?"
    );

    if (!confirmDelete) {
      return;
    }

    setMoodLogs((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }
  }

  // ===============================
  // SORT MOOD HISTORY
  // ===============================

  const sortedLogs = useMemo(() => {
    return [...moodLogs].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [moodLogs]);

  // ===============================
  // MOOD DISTRIBUTION
  // ===============================

  const chartData = useMemo(() => {
    return moods
      .map((mood) => {
        const count = moodLogs.filter(
          (item) => item.moodLabel === mood.moodLabel
        ).length;

        const percentage =
          moodLogs.length > 0
            ? Math.round((count / moodLogs.length) * 100)
            : 0;

        return {
          name: mood.moodLabel,
          value: count,
          color: mood.color,
          emoji: mood.emoji,
          percentage: percentage,
        };
      })
      .filter((item) => item.value > 0);
  }, [moodLogs]);

  // ===============================
  // MOST FREQUENT MOOD
  // ===============================

  const mostFrequentMood = [...chartData].sort(
    (a, b) => b.value - a.value
  )[0];

  // ===============================
  // DATE FORMAT
  // ===============================

  function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // ===============================
  // UI
  // ===============================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <header className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

          <div>

            <div className="flex items-center gap-2 text-purple-600 mb-2">

              <Heart size={22} />

              <span className="font-semibold text-sm">
                LIFESYNC WELLNESS
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-bold">
              Mood Tracker
            </h1>

            <p className="text-slate-500 mt-2">
              Understand your emotions and take care of your mental well-being.
            </p>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4 flex items-center gap-3 h-fit">

            <div className="bg-purple-100 p-3 rounded-xl">
              <Sparkles className="text-purple-600" />
            </div>

            <div>

              <p className="text-sm text-slate-500">
                Your journey
              </p>

              <p className="font-bold">
                {moodLogs.length} Mood Entries
              </p>

            </div>

          </div>

        </header>

        {/* STATISTICS */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <BookOpen className="text-purple-500" />

            <p className="text-slate-500 text-sm mt-3">
              Total Entries
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {moodLogs.length}
            </h2>

          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <TrendingUp className="text-green-500" />

            <p className="text-slate-500 text-sm mt-3">
              Most Frequent Mood
            </p>

            <h2 className="text-2xl font-bold mt-2">

              {mostFrequentMood
                ? `${mostFrequentMood.emoji} ${mostFrequentMood.name}`
                : "No data yet"}

            </h2>

          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <CalendarDays className="text-blue-500" />

            <p className="text-slate-500 text-sm mt-3">
              Today's Date
            </p>

            <h2 className="text-xl font-bold mt-2">

              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}

            </h2>

          </div>

        </section>

        {/* MOOD SELECTOR */}

        <section className="bg-white rounded-2xl shadow-sm border p-5 sm:p-7 mb-8">

          <h2 className="text-xl font-bold mb-2">
            How are you feeling today?
          </h2>

          <p className="text-slate-500 text-sm mb-6">
            Take a moment to understand your emotions.
          </p>

          {/* MOOD BUTTONS */}

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">

            {moods.map((mood) => (

              <button
                key={mood.moodLabel}
                type="button"
                onClick={() => setSelectedMood(mood)}
                className={`rounded-2xl border-2 p-4 transition-all hover:scale-105 ${
                  selectedMood?.moodLabel === mood.moodLabel
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-slate-100 bg-slate-50 hover:border-purple-200"
                }`}
              >

                <div className="text-4xl mb-2">
                  {mood.emoji}
                </div>

                <p className="font-semibold text-sm">
                  {mood.moodLabel}
                </p>

              </button>

            ))}

          </div>

          {/* DATE SELECTOR */}

          <label className="block text-sm font-semibold mb-2">
            Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            max={getToday()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-64 border rounded-xl p-3 mb-5 outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* MOOD NOTE */}

          <label className="block text-sm font-semibold mb-2">
            Add a Note (Optional)
          </label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write about how you feel today..."
            rows="3"
            className="w-full border rounded-xl p-3 resize-none outline-none focus:ring-2 focus:ring-purple-400 mb-6"
          />

          {/* SAVE BUTTON */}

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={handleSaveMood}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >

              <Save size={18} />

              {editingId ? "Update Mood" : "Save Mood"}

            </button>

            {editingId && (

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-slate-50"
              >

                <X size={18} />

                Cancel

              </button>

            )}

          </div>

        </section>

        {/* HISTORY AND CHART */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* MOOD HISTORY */}

          <section className="bg-white rounded-2xl shadow-sm border p-5 sm:p-7">

            <h2 className="text-xl font-bold mb-5">
              Mood History
            </h2>

            {sortedLogs.length === 0 ? (

              <div className="text-center py-12">

                <div className="text-5xl mb-3">
                  📖
                </div>

                <p className="font-semibold">
                  No mood entries yet
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Start tracking your emotions today!
                </p>

              </div>

            ) : (

              <div className="space-y-4 max-h-[500px] overflow-y-auto">

                {sortedLogs.map((entry) => (

                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border"
                  >

                    <div className="text-3xl bg-white rounded-xl p-3">
                      {entry.emoji}
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap justify-between gap-2">

                        <h3 className="font-bold">
                          {entry.moodLabel}
                        </h3>

                        <span className="text-xs text-slate-500">
                          {formatDate(entry.date)}
                        </span>

                      </div>

                      <p className="text-sm text-slate-500 mt-2 break-words">
                        {entry.note || "No note added"}
                      </p>

                      <div className="flex gap-3 mt-3">

                        <button
                          type="button"
                          onClick={() => handleEdit(entry)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                        >

                          <Pencil size={15} />

                          Edit

                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                        >

                          <Trash2 size={15} />

                          Delete

                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* MOOD DISTRIBUTION */}

          <section className="bg-white rounded-2xl shadow-sm border p-5 sm:p-7">

            <h2 className="text-xl font-bold mb-2">
              Mood Distribution
            </h2>

            <p className="text-sm text-slate-500 mb-4">
              Understand your emotional patterns.
            </p>

            {moodLogs.length === 0 ? (

              <div className="text-center py-16">

                <div className="text-5xl mb-3">
                  📊
                </div>

                <p className="font-semibold">
                  No statistics available
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Add mood entries to see your chart.
                </p>

              </div>

            ) : (

              <>

                {/* DONUT CHART */}

                <div className="h-64">

                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={4}
                      >

                        {chartData.map((entry) => (

                          <Cell
                            key={entry.name}
                            fill={entry.color}
                          />

                        ))}

                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          `${value} entries`,
                          name,
                        ]}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                {/* PERCENTAGE DISPLAY */}

                <div className="space-y-4 mt-5">

                  {chartData.map((item) => (

                    <div key={item.name}>

                      <div className="flex justify-between text-sm mb-2">

                        <span className="font-medium">
                          {item.emoji} {item.name}
                        </span>

                        <span className="text-slate-500">
                          {item.percentage}%
                        </span>

                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2">

                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </>

            )}

          </section>

        </div>

        {/* FOOTER */}

        <footer className="text-center mt-10 pb-5">

          <p className="text-sm text-slate-400">
            Made with 💜 for a healthier and happier you.
          </p>

          <p className="text-xs text-slate-400 mt-1">
            LifeSync – Your Personal Wellness Companion
          </p>

        </footer>

      </div>

    </div>
  );
}