import React, { useEffect, useState } from "react";
import axios from "axios";

// Defining the type for a reminder
type Reminder = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  client?: {
    name: string;
  };
};

const ReminderSummary = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get("/api/reminders/due-this-week");
        setReminders(response.data);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchReminders();
  }, []);

  return (
    <div>
      <h3>Reminders Due This Week</h3>
      {reminders.length === 0 ? (
        <p>No reminders due this week.</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              <strong>{reminder.title}</strong>
              <p>{reminder.description}</p>
              <p>Due Date: {new Date(reminder.dueDate).toLocaleDateString()}</p>
              <p>Client: {reminder.client?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderSummary;
