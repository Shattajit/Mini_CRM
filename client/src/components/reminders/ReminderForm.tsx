import React, { useState } from "react";
import axios from "axios";

const AddReminder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/reminders", {
        title,
        description,
        dueDate,
        clientId,
      });
      setMessage("Reminder added successfully!");
    } catch (error) {
      setMessage("Failed to add reminder.");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h3>Add Reminder</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Reminder Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Reminder Description"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Reminder</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddReminder;
