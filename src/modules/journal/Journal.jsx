import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Save
} from "lucide-react";

import "./Journal.css";

const STORAGE_KEY = "lifesync_journal";

export default function Journal() {

  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    entryDate: new Date().toISOString().split("T")[0],
    tags: ""
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries)
    );
  }, [entries]);

  const resetForm = () => {
    setForm({
      title: "",
      content: "",
      entryDate: new Date().toISOString().split("T")[0],
      tags: ""
    });
  };

  const openNewEntry = () => {
    setSelected(null);
    resetForm();
    setView("editor");
  };

  const saveEntry = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Please enter title and description");
      return;
    }

    const entry = {
      id: selected?.id || Date.now(),
      title: form.title.trim(),
      content: form.content.trim(),
      entryDate: form.entryDate,
      tags: form.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean)
    };

    if (selected) {
      setEntries(prev =>
        prev.map(item =>
          item.id === selected.id ? entry : item
        )
      );
    } else {
      setEntries(prev => [...prev, entry]);
    }

    setSelected(null);
    resetForm();
    setView("list");
  };

  const editEntry = (entry) => {
    setSelected(entry);

    setForm({
      title: entry.title,
      content: entry.content,
      entryDate: entry.entryDate,
      tags: entry.tags.join(", ")
    });

    setView("editor");
  };

  const deleteEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(prev =>
        prev.filter(item => item.id !== id)
      );

      setSelected(null);
      setView("list");
    }
  };

  const filteredEntries = entries
    .filter(entry =>
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.content.toLowerCase().includes(search.toLowerCase()) ||
      entry.tags.some(tag =>
        tag.toLowerCase().includes(search.toLowerCase())
      )
    )
    .sort(
      (a, b) =>
        new Date(b.entryDate) - new Date(a.entryDate)
    );

  return (
    <div className="journal-page">

      <div className="journal-header">

        <div className="journal-heading">
          <BookOpen size={30} />

          <div>
            <h1>Digital Journal</h1>
            <p>Your personal space to write and reflect.</p>
          </div>
        </div>

        {view === "list" && (
          <button
            className="journal-add"
            onClick={openNewEntry}
          >
            <Plus size={18} />
            New Entry
          </button>
        )}

      </div>

      {view === "list" && (
        <>

          <div className="journal-summary">
            <h2>{entries.length}</h2>
            <p>Total Journal Entries</p>
          </div>

          <div className="journal-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search by title, keyword or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <h2 className="journal-section-title">
            Your Journal Entries
          </h2>

          {filteredEntries.length === 0 ? (

            <div className="journal-empty">
              <BookOpen size={45} />

              <h3>No journal entries found</h3>

              <p>Start writing your first journal entry!</p>

              <button onClick={openNewEntry}>
                Create Entry
              </button>
            </div>

          ) : (

            <div className="journal-list">

              {filteredEntries.map(entry => (

                <div
                  className="journal-card"
                  key={entry.id}
                >

                  <div className="journal-date">
                    {entry.entryDate}
                  </div>

                  <h3>{entry.title}</h3>

                  <p className="journal-preview">
                    {entry.content.slice(0, 150)}
                    {entry.content.length > 150 ? "..." : ""}
                  </p>

                  <div className="journal-tags">
                    {entry.tags.map((tag, index) => (
                      <span key={index}>
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="journal-actions">

                    <button
                      onClick={() => {
                        setSelected(entry);
                        setView("read");
                      }}
                    >
                      Read
                    </button>

                    <button
                      onClick={() => editEntry(entry)}
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteEntry(entry.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </>
      )}

      {view === "editor" && (

        <div className="journal-editor">

          <button
            className="journal-back"
            onClick={() => {
              setSelected(null);
              resetForm();
              setView("list");
            }}
          >
            <ArrowLeft size={18} />
            Back to Journal
          </button>

          <h2>
            {selected ? "Edit Entry" : "Create New Entry"}
          </h2>

          <form onSubmit={saveEntry}>

            <label>Entry Title</label>

            <input
              type="text"
              placeholder="Give your journal a title"
              value={form.title}
              onChange={e =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <label>Entry Date</label>

            <input
              type="date"
              value={form.entryDate}
              onChange={e =>
                setForm({ ...form, entryDate: e.target.value })
              }
              required
            />

            <label>Your Thoughts</label>

            <textarea
              rows="8"
              placeholder="Write about your day, thoughts and experiences..."
              value={form.content}
              onChange={e =>
                setForm({ ...form, content: e.target.value })
              }
              required
            />

            <label>Tags (comma separated)</label>

            <input
              type="text"
              placeholder="Personal, Happiness, College"
              value={form.tags}
              onChange={e =>
                setForm({ ...form, tags: e.target.value })
              }
            />

            <button
              type="submit"
              className="journal-save"
            >
              <Save size={18} />

              {selected ? "Update Entry" : "Save Entry"}
            </button>

          </form>

        </div>

      )}

      {view === "read" && selected && (

        <div className="journal-reader">

          <button
            className="journal-back"
            onClick={() => setView("list")}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <p className="journal-date">
            {selected.entryDate}
          </p>

          <h2>{selected.title}</h2>

          <div className="journal-full-content">
            {selected.content}
          </div>

          <div className="journal-tags">
            {selected.tags.map((tag, index) => (
              <span key={index}>
                #{tag}
              </span>
            ))}
          </div>

          <div className="journal-actions">

            <button onClick={() => editEntry(selected)}>
              <Edit size={16} />
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteEntry(selected.id)}
            >
              <Trash2 size={16} />
              Delete
            </button>

          </div>

        </div>

      )}

    </div>
  );
}