import axios from "axios";

const API_URL = "http://your-backend-api-url";

export const getReminders = async () => {
  const response = await axios.get(`${API_URL}/reminders`);
  return response.data;
};

export {};
