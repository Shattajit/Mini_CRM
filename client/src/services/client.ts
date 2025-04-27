import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const createClient = async (client: any) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, client, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Full error details in backend:", error);
    throw error;
  }
};

export const updateClient = async (id: string, client: any) => {
  try {
    const response = await axios.put(`${API_URL}/clients/${id}`, client);
    return response.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

export const deleteClient = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/clients/${id}`);
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};
