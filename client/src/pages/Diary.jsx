import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Diary.css";

function Diary() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [monthEntries, setMonthEntries] = useState(new Set());
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchEntries = async (dateToFetch) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/diary?date=${dateToFetch.toISOString()}`,
        { headers: { Authorization: token } }
      );
      setEntries(res.data);
    } catch (error) {
      console.error("Fetch Entries Error:", error.response?.data || error.message);
      if (error.response?.status === 401) navigate("/login");
    }
  };

  const fetchMonthEntries = async (date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const res = await axios.get(
        `http://localhost:5000/api/diary/month?year=${year}&month=${month}`,
        { headers: { Authorization: token } }
      );

      const dates = new Set(res.data.map((e) => new Date(e.createdAt).toDateString()));
      setMonthEntries(dates);
    } catch (error) {
      console.error("Fetch Month Entries Error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchEntries(selectedDate);
      fetchMonthEntries(selectedDate);
    }
  }, [selectedDate, token]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchEntries(date);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing entry
        await axios.put(
          `http://localhost:5000/api/diary/${editId}`,
          { title: form.title, content: form.content },
          { headers: { Authorization: token } }
        );
        setIsEditing(false);
        setEditId(null);
      } else {
        // Create new entry
        await axios.post(
          "http://localhost:5000/api/diary/create",
          { ...form, date: selectedDate.toISOString() },
          { headers: { Authorization: token } }
        );
      }
      setForm({ title: "", content: "" });
      fetchEntries(selectedDate);
    } catch (error) {
      console.error("Entry Save Error:", error.response?.data || error.message);
      alert("Failed to save entry");
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/diary/${entryId}`, {
        headers: { Authorization: token },
      });
      fetchEntries(selectedDate);
    } catch (error) {
      console.error("Delete Entry Error:", error.response?.data || error.message);
      alert("Failed to delete entry");
    }
  };

  const handleEdit = (entry) => {
    setIsEditing(true);
    setEditId(entry._id);
    setForm({ title: entry.title, content: entry.content });
  };

  const cancelEdit = () => {
  setIsEditing(false);
  setEditId(null);
  setForm({ title: "", content: "" });
};


  const formatDate = (d) =>
    d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="diary-container">
      <div className="calendar-container">
        <h3>📅 My Diary</h3>
        <Calendar
          value={selectedDate}
          onChange={handleDateChange}
          onActiveStartDateChange={({ activeStartDate }) =>
            fetchMonthEntries(activeStartDate)
          }
          tileContent={({ date }) =>
            monthEntries.has(date.toDateString()) ? <span className="dot"></span> : null
          }
        />
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="entry-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Entry Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Your thoughts..."
            value={form.content}
            onChange={handleChange}
            required
          />
          <div style={{ display: "flex", gap: "10px" }}>
  <button type="submit">
    {isEditing ? "✏️ Update Entry" : "➕ Add Entry"}
  </button>
  {isEditing && (
    <button type="button" onClick={cancelEdit} style={{ backgroundColor: "#ccc" }}>
      ❌ Cancel
    </button>
  )}
</div>

        </form>

        <div className="entries-list">
          <h3>Entries for {formatDate(selectedDate)}</h3>
          {entries.length === 0 ? (
            <p>No entries found for this date.</p>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="entry-item">
                <div className="entry-header">
                  <h4>{entry.title}</h4>
                  <div>
                    <span
                      className="edit-entry"
                      onClick={() => handleEdit(entry)}
                      title="Edit"
                      style={{ cursor: "pointer", marginRight: "8px" }}
                    >
                      ✏️
                    </span>
                    <span
                      className="delete-entry"
                      onClick={() => handleDelete(entry._id)}
                      title="Delete"
                      style={{ cursor: "pointer" }}
                    >
                      🗑️
                    </span>
                  </div>
                </div>
                <p>{entry.content}</p>
                <small>{new Date(entry.createdAt).toLocaleTimeString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Diary;
