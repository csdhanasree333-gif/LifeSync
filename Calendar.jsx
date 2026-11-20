
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Clock,
} from "lucide-react";

const STORAGE_KEY = "lifesync_events";

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const [events, setEvents] = useState(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      return savedEvents ? JSON.parse(savedEvents) : [];
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: getLocalDateString(new Date()),
    startTime: "",
    endTime: "",
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  // Save events whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Previous month or week
  const previousMonth = () => {
    if (view === "week") {
      setCurrentDate(
        new Date(year, month, currentDate.getDate() - 7)
      );
    } else {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  // Next month or week
  const nextMonth = () => {
    if (view === "week") {
      setCurrentDate(
        new Date(year, month, currentDate.getDate() + 7)
      );
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Open form for a new event
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

  // Open form to edit an event
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

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update an event
  const handleSubmit = (e) => {
    e.preventDefault();

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
        previous.map((event) =>
          event.id === editingId
            ? { ...event, ...formData, title: formData.title.trim() }
            : event
        )
      );
    } else {
      const newEvent = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...formData,
        title: formData.title.trim(),
      };

      setEvents((previous) => [...previous, newEvent]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  // Delete an event
  const deleteEvent = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    setEvents((previous) =>
      previous.filter((event) => event.id !== id)
    );

    setShowForm(false);
    setEditingId(null);
  };

  // Get events for a particular date
  const getEventsForDate = (date) => {
    const dateString = getLocalDateString(date);

    return events
      .filter((event) => event.date === dateString)
      .sort((a, b) =>
        (a.startTime || "").localeCompare(b.startTime || "")
      );
  };

  // Create month calendar dates
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    calendarDays.push(day);
  }

  // Create week dates
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });

  // Check today's date
  const isToday = (date) => {
    return getLocalDateString(date) === getLocalDateString(today);
  };

  // Upcoming events
  const todayString = getLocalDateString(today);

  const upcomingEvents = [...events]
    .filter((event) => event.date >= todayString)
    .sort((a, b) => {
      const first = `${a.date}T${a.startTime || "00:00"}`;
      const second = `${b.date}T${b.startTime || "00:00"}`;
      return first.localeCompare(second);
    })
    .slice(0, 5);

  const weekHeading = `${weekDays[0].toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} - ${weekDays[6].toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <CalendarDays size={30} color="#2563eb" />
            <h1 style={styles.title}>Calendar Management</h1>
          </div>

          <p style={styles.subtitle}>
            Organize your schedule and manage your important dates.
          </p>
        </div>

        <button style={styles.todayButton} onClick={goToToday}>
          Today
        </button>
      </div>

      {/* Calendar */}
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
                onClick={previousMonth}
                aria-label="Previous"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                style={styles.navButton}
                onClick={nextMonth}
                aria-label="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Month View */}
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

              const dayEvents = date ? getEventsForDate(date) : [];

              return (
                <div
                  key={index}
                  style={{
                    ...styles.dayCell,
                    ...(date && isToday(date) ? styles.todayCell : {}),
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

                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          style={styles.eventBadge}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(event);
                          }}
                          title="Click to edit event"
                        >
                          {event.title}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Week View */}
        {view === "week" && (
          <div style={styles.calendarGrid}>
            {weekDays.map((date) => {
              const dayEvents = getEventsForDate(date);

              return (
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

                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      style={styles.eventBadge}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(event);
                      }}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        <p style={styles.hint}>
          Tip: Click a date to add an event. Click a blue event badge to edit it.
        </p>
      </div>

      {/* Upcoming Events */}
      <div style={styles.upcomingCard}>
        <h2 style={styles.upcomingTitle}>Upcoming Events</h2>

        {upcomingEvents.length === 0 ? (
          <p style={styles.emptyText}>
            No upcoming events. Add an event to get started!
          </p>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event.id} style={styles.upcomingItem}>
              <div style={styles.eventDot} />

              <div style={styles.upcomingDetails}>
                <strong>{event.title}</strong>

                <span style={styles.eventDate}>
                  {new Date(`${event.date}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>

                {event.startTime && (
                  <span style={styles.eventDate}>
                    <Clock size={13} /> {event.startTime}
                    {event.endTime ? ` - ${event.endTime}` : ""}
                  </span>
                )}
              </div>

              <button
                style={styles.editButton}
                onClick={() => openEditForm(event)}
                aria-label="Edit event"
              >
                <Pencil size={17} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {showForm && (
        <div
          style={styles.overlay}
          onClick={() => setShowForm(false)}
        >
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId !== null ? "Edit Event" : "Add New Event"}
              </h2>

              <button
                style={styles.closeButton}
                onClick={() => setShowForm(false)}
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
                    <Trash2 size={16} /> Delete
                  </button>
                )}

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowForm(false)}
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
    marginBottom: "28px",
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
    minHeight: "85px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px",
    background: "#fff",
    cursor: "pointer",
    overflow: "hidden",
  },
  weekCell: {
    minHeight: "150px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "12px 5px",
    background: "#fff",
    textAlign: "center",
    cursor: "pointer",
    overflow: "hidden",
  },
  dayNumber: {
    fontSize: "14px",
  },
  weekNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    marginTop: "10px",
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
    marginTop: "6px",
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
    background: "#2563eb",
    flexShrink: 0,
  },
  upcomingDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
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
