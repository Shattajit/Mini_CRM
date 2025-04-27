import axios from "axios";
import { Reminder, ReminderFormData } from "../types/reminder";

const API_URL = "/api/reminders";

export const createReminder = async (
  data: ReminderFormData
): Promise<Reminder> => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const getReminders = async (params?: {
  clientId?: string;
  projectId?: string;
  upcoming?: boolean;
}): Promise<Reminder[]> => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const updateReminder = async (
  id: string,
  data: Partial<ReminderFormData & { isCompleted: boolean }>
): Promise<Reminder> => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteReminder = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
