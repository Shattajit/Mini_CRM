import React, { useEffect, useState } from "react";
import { getReminders } from "../services/reminderService";
import { Reminder } from "../types/reminder";
import { format } from "date-fns";

// Defining the component props
interface RemindersListProps {
  clientId?: string;
  projectId?: string;
}

const RemindersList: React.FC<RemindersListProps> = ({
  clientId,
  projectId,
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetching reminders when component mounts or props change
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getReminders({
          clientId,
          projectId,
          upcoming: true,
        });
        setReminders(data);
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [clientId, projectId]);

  // Loading state or no reminders
  if (loading) return <div>Loading reminders...</div>;
  if (!reminders.length) return <div>No upcoming reminders</div>;

  return (
    <div className="reminders-container">
      <h3>Upcoming Reminders</h3>
      <ul>
        {reminders.map((reminder) => (
          <li key={reminder.id} className="reminder-item">
            <div className="reminder-title">{reminder.title}</div>
            <div className="reminder-due">
              Due: {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
            </div>
            {reminder.description && (
              <div className="reminder-desc">{reminder.description}</div>
            )}
            {reminder.client && (
              <div className="reminder-client">
                Client: {reminder.client.name}
              </div>
            )}
            {reminder.project && (
              <div className="reminder-project">
                Project: {reminder.project.title}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemindersList;
