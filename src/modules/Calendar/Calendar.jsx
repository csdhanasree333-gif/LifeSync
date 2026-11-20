
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Pencil,
  Trash2,
  X,
  Clock,
  ListTodo,
  CheckCircle2,
} from "lucide-react";

const EVENTS_KEY = "lifesync_events";
const TASKS_KEY = "lifesync_tasks";

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const [events, setEvents] = useState(() =>
    readStoredArray(EVENTS_KEY)
  );

  const [tasks, setTasks] = useState(() =>
    readStoredArray(TASKS_KEY)
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: getLocalDateString(new Date()),
    startTime: "",
    endTime: "",
  });

  const todayString = getLocalDateString(new Date());

  // Save personal events.
  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Unable to save events:", error);
    }
  }, [events]);

  // Refresh tasks when returning to Calendar.
  useEffect(() => {
    const refreshTasks = () => {
      setTasks(readStoredArray(TASKS_KEY));
    };

    window.addEventListener("storage", refreshTasks);
    window.addEventListener("focus", refreshTasks);
    window.addEventListener("pageshow", refreshTasks);

    document.addEventListener("visibilitychange", refreshTasks);

    refreshTasks();

    return () => {
      window.removeEventListener("storage", refreshTasks);
      window.removeEventListener("focus", refreshTasks);
      window.removeEventListener("pageshow", refreshTasks);
      document.removeEventListener("visibilitychange", refreshTasks);
    };
  }, []);

  // Read ALL tasks, including completed tasks.
  const validTasks = tasks.filter(
    (task) =>
      task &&
      typeof task.id === "string" &&
      typeof task.title === "string" &&
      typeof task.deadline === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(task.deadline)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const previousPeriod = () => {
    if (view === "week") {
      setCurrentDate(
        new Date(year, month, currentDate.getDate() - 7)
      );
    } else {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const nextPeriod = () => {
    if (view === "week") {
      setCurrentDate(
        new Date(year, month, currentDate.getDate() + 7)
      );
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const openAddForm = (date) => {
    setEditingId(null);

    setFormData({
      title: "",
      description: "",
      date: getLocalDateString(date),
      startTime: "",
      endTime: "",
    });

    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event.id);

    setFormData({
      title: event.title,
      description: event.description || "",
      date: event.date,
      startTime: event.startTime || "",
      endTime: event.endTime || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update personal events.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim() || !formData.date) {
      alert("Please enter an event title and date.");
      return;
    }

    if (
      formData.startTime &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      alert("End time must be later than start time.");
      return;
    }

    if (editingId !== null) {
      setEvents((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                title: formData.title.trim(),
              }
            : item
        )
      );
    } else {
      setEvents((previous) => [
        ...previous,
        {
          id: `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`,
          ...formData,
          title: formData.title.trim(),
        },
      ]);
    }

    closeForm();
  };

  const deleteEvent = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setEvents((previous) =>
      previous.filter((item) => item.id !== id)
    );

    closeForm();
  };

  const getEventsForDate = (date) => {
    const dateString = getLocalDateString(date);

    return events
      .filter((event) => event.date === dateString)
      .sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || "")
      );
  };

  // Get both pending and completed tasks for a date.
  const getTasksForDate = (date) => {
    const dateString = getLocalDateString(date);

    return validTasks.filter(
      (task) => task.deadline === dateString
    );
  };

  const isToday = (date) =>
    getLocalDateString(date) === todayString;

  // Monthly calendar dates.
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, index) => index + 1),
  ];

  // Weekly calendar dates.
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  const weekHeading = `${weekDays[0].toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${weekDays[6].toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  // Show future personal events, future pending tasks,
  // AND all completed tasks, including past completed tasks.
  const upcomingItems = [
    ...events
      .filter(
        (event) =>
          event.date &&
          event.date >= todayString
      )
      .map((event) => ({
        ...event,
        itemType: "event",
      })),

    ...validTasks
      .filter(
        (task) =>
          task.isCompleted === true ||
          task.deadline >= todayString
      )
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        date: task.deadline,
        itemType: "task",
        priority: task.priority,
        isCompleted: task.isCompleted === true,
      })),
  ].sort((a, b) => {
    const first = `${a.date}T${a.startTime || "00:00"}`;
    const second = `${b.date}T${b.startTime || "00:00"}`;
    return first.localeCompare(second);
  });

  // Render personal events and task badges.
  const renderDateContents = (date) => (
    <>
      {getEventsForDate(date).map((event) => (
        <button
          key={`event-${event.id}`}
          type="button"
          style={styles.eventBadge}
          onClick={(clickEvent) => {
            clickEvent.stopPropagation();
            openEditForm(event);
          }}
          title="Click to edit personal event"
        >
          {event.title}
        </button>
      ))}

      {getTasksForDate(date).map((task) => {
        const completed = task.isCompleted === true;

        return (
          <div
            key={`task-${task.id}`}
            style={{
              ...styles.taskBadge,
              ...(completed
                ? styles.completedTaskBadge
                : styles.pendingTaskBadge),
            }}
            title={
              completed
                ? "Completed task"
                : "Pending task deadline"
            }
          >
            {completed ? (
              <CheckCircle2 size={11} />
            ) : (
              <ListTodo size={11} />
            )}

            <span>{task.title}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <CalendarDays size={30} color="#2563eb" />
            <h1 style={styles.title}>Calendar Management</h1>
          </div>

          <p style={styles.subtitle}>
            Organize your personal events and track your task deadlines.
          </p>
        </div>

        <button style={styles.todayButton} onClick={goToToday}>
          Today
        </button>
      </div>

      {/* LEGEND */}
      <div style={styles.legend}>
        <span>
          <i style={styles.eventLegendDot} />
          Personal events
        </span>

        <span>
          <i style={styles.pendingLegendDot} />
          Pending tasks
        </span>

        <span>
          <i style={styles.completedLegendDot} />
          Completed tasks
        </span>
      </div>

      {/* CALENDAR */}
      <div style={styles.calendarCard}>
        <div style={styles.monthHeader}>
          <h2 style={styles.monthTitle}>
            {view === "month" ? `${monthName} ${year}` : weekHeading}
          </h2>

          <div style={styles.controls}>
            <div style={styles.viewButtons}>
              <button
                onClick={() => setView("month")}
                style={{
                  ...styles.viewButton,
                  ...(view === "month" ? styles.activeView : {}),
                }}
              >
                Month
              </button>

              <button
                onClick={() => setView("week")}
                style={{
                  ...styles.viewButton,
                  ...(view === "week" ? styles.activeView : {}),
                }}
              >
                Week
              </button>
            </div>

            <div style={styles.navigation}>
              <button
                style={styles.navButton}
                onClick={previousPeriod}
                aria-label="Previous period"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                style={styles.navButton}
                onClick={nextPeriod}
                aria-label="Next period"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* MONTH VIEW */}
        {view === "month" && (
          <div style={styles.calendarGrid}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div key={day} style={styles.weekday}>
                  {day}
                </div>
              )
            )}

            {calendarDays.map((day, index) => {
              const date =
                day !== null ? new Date(year, month, day) : null;

              return (
                <div
                  key={index}
                  style={{
                    ...styles.dayCell,
                    ...(date && isToday(date) ? styles.todayCell : {}),
                    ...(!date ? styles.emptyDayCell : {}),
                  }}
                  onClick={() => date && openAddForm(date)}
                  title={date ? "Click to add an event" : ""}
                >
                  {day !== null && (
                    <>
                      <span
                        style={{
                          ...styles.dayNumber,
                          ...(isToday(date) ? styles.todayNumber : {}),
                        }}
                      >
                        {day}
                      </span>

                      {renderDateContents(date)}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* WEEK VIEW */}
        {view === "week" && (
          <div style={styles.calendarGrid}>
            {weekDays.map((date) => (
              <div
                key={getLocalDateString(date)}
                style={{
                  ...styles.weekCell,
                  ...(isToday(date) ? styles.todayCell : {}),
                }}
                onClick={() => openAddForm(date)}
              >
                <div style={styles.weekday}>
                  {date.toLocaleDateString("en-IN", {
                    weekday: "short",
                  })}
                </div>

                <div
                  style={{
                    ...styles.weekNumber,
                    ...(isToday(date) ? styles.todayNumber : {}),
                  }}
                >
                  {date.getDate()}
                </div>

                {renderDateContents(date)}
              </div>
            ))}
          </div>
        )}

        <p style={styles.hint}>
          Click a date to add an event. Click a blue badge to edit or
          delete a personal event. Task deadlines are read from Task
          Management.
        </p>
      </div>

      {/* EVENTS, DEADLINES AND COMPLETED TASKS */}
      <div style={styles.upcomingCard}>
        <h2 style={styles.upcomingTitle}>
          Events, Deadlines & Completed Tasks
        </h2>

        {upcomingItems.length === 0 ? (
          <p style={styles.emptyText}>
            Nothing to display. Add an event or create a task with a deadline.
          </p>
        ) : (
          upcomingItems.map((item) => {
            const completed =
              item.itemType === "task" && item.isCompleted;

            return (
              <div
                key={`${item.itemType}-${item.id}`}
                style={styles.upcomingItem}
              >
                <div
                  style={{
                    ...styles.eventDot,
                    background:
                      item.itemType === "event"
                        ? "#2563eb"
                        : completed
                        ? "#16a34a"
                        : "#f59e0b",
                  }}
                />

                <div style={styles.upcomingDetails}>
                  <strong>{item.title}</strong>

                  <span style={styles.eventDate}>
                    {formatDate(item.date)}
                    {item.itemType === "task"
                      ? completed
                        ? " • Completed task"
                        : " • Pending task deadline"
                      : " • Personal event"}
                  </span>

                  {item.itemType === "event" && item.startTime && (
                    <span style={styles.eventDate}>
                      <Clock size={13} />
                      {item.startTime}
                      {item.endTime ? ` - ${item.endTime}` : ""}
                    </span>
                  )}

                  {item.itemType === "task" && item.priority && (
                    <span style={styles.eventDate}>
                      {item.priority} priority
                    </span>
                  )}
                </div>

                {completed && (
                  <CheckCircle2
                    size={19}
                    color="#16a34a"
                    title="Completed"
                  />
                )}

                {item.itemType === "event" && (
                  <button
                    style={styles.editButton}
                    onClick={() => openEditForm(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil size={17} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* EVENT FORM */}
      {showForm && (
        <div style={styles.overlay} onClick={closeForm}>
          <div
            style={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId !== null ? "Edit Event" : "Add New Event"}
              </h2>

              <button
                style={styles.closeButton}
                onClick={closeForm}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Event Title *</label>

              <input
                style={styles.input}
                type="text"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label style={styles.label}>Description</label>

              <textarea
                style={styles.textarea}
                name="description"
                placeholder="Enter event description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />

              <label style={styles.label}>Date *</label>

              <input
                style={styles.input}
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />

              <div style={styles.timeRow}>
                <div style={styles.timeField}>
                  <label style={styles.label}>Start Time</label>

                  <input
                    style={styles.input}
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div style={styles.timeField}>
                  <label style={styles.label}>End Time</label>

                  <input
                    style={styles.input}
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.formButtons}>
                {editingId !== null && (
                  <button
                    type="button"
                    style={styles.deleteButton}
                    onClick={() => deleteEvent(editingId)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" style={styles.saveButton}>
                  {editingId !== null ? "Update Event" : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLES
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "18px",
  },

  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  title: {
    fontSize: "28px",
    margin: 0,
  },

  subtitle: {
    color: "#64748b",
    marginTop: "10px",
  },

  todayButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "11px 22px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
    marginBottom: "18px",
    color: "#64748b",
    fontSize: "13px",
  },

  eventLegendDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#2563eb",
    marginRight: "6px",
  },

  pendingLegendDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#f59e0b",
    marginRight: "6px",
  },

  completedLegendDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    borderRadius: "50%",
    background: "#16a34a",
    marginRight: "6px",
  },

  calendarCard: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
  },

  monthHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },

  monthTitle: {
    fontSize: "22px",
    margin: 0,
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  viewButtons: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "4px",
  },

  viewButton: {
    border: "none",
    background: "transparent",
    padding: "9px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#64748b",
    fontWeight: "bold",
  },

  activeView: {
    background: "#2563eb",
    color: "white",
  },

  navigation: {
    display: "flex",
    gap: "10px",
  },

  navButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "white",
    border: "1px solid #dbe3ee",
    borderRadius: "8px",
    padding: "9px",
    cursor: "pointer",
  },

  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: "8px",
  },

  weekday: {
    textAlign: "center",
    padding: "12px 2px",
    color: "#64748b",
    fontWeight: "bold",
  },

  dayCell: {
    minHeight: "92px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "8px",
    background: "#fff",
    cursor: "pointer",
    overflow: "hidden",
    minWidth: 0,
  },

  emptyDayCell: {
    cursor: "default",
    background: "#f8fafc",
  },

  weekCell: {
    minHeight: "160px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 6px",
    background: "#fff",
    textAlign: "center",
    cursor: "pointer",
    overflow: "hidden",
    minWidth: 0,
  },

  dayNumber: {
    fontSize: "14px",
    display: "block",
    marginBottom: "3px",
  },

  weekNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "8px 0",
  },

  todayCell: {
    background: "#eff6ff",
    border: "2px solid #2563eb",
  },

  todayNumber: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  eventBadge: {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "5px",
    padding: "5px 6px",
    background: "#dbeafe",
    color: "#1d4ed8",
    border: "none",
    borderRadius: "5px",
    fontSize: "11px",
    textAlign: "left",
    cursor: "pointer",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  taskBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "5px",
    padding: "5px 6px",
    borderRadius: "5px",
    fontSize: "11px",
    textAlign: "left",
    overflow: "hidden",
    minWidth: 0,
  },

  pendingTaskBadge: {
    background: "#fef3c7",
    color: "#92400e",
  },

  completedTaskBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  hint: {
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "18px",
  },

  upcomingCard: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    marginTop: "24px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
  },

  upcomingTitle: {
    fontSize: "20px",
    marginTop: 0,
  },

  emptyText: {
    color: "#94a3b8",
  },

  upcomingItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid #e2e8f0",
  },

  eventDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },

  upcomingDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
    minWidth: 0,
  },

  eventDate: {
    color: "#64748b",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  editButton: {
    background: "#eff6ff",
    color: "#2563eb",
    border: "none",
    padding: "9px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: 1000,
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.2)",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  modalTitle: {
    margin: 0,
    fontSize: "22px",
  },

  closeButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "14px",
    fontWeight: "bold",
    fontSize: "13px",
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "14px",
    outlineColor: "#2563eb",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
  },

  timeRow: {
    display: "flex",
    gap: "12px",
  },

  timeField: {
    flex: 1,
    minWidth: 0,
  },

  formButtons: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: "9px",
    marginTop: "24px",
  },

  saveButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelButton: {
    background: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: "7px",
    padding: "11px 16px",
    cursor: "pointer",
  },

  deleteButton: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "7px",
    padding: "11px 13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default Calendar;
