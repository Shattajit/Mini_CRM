import axios from "axios";

const API_URL = "http://localhost:5000/api";

export interface InteractionLog {
  id: string;
  date: string;
  interactionType: string;
  notes?: string;
  clientId: string;
  projectId?: string;
}

export const createInteraction = async (data: {
  date?: string;
  interactionType: string;
  notes?: string;
  clientId: string;
  projectId?: string;
}): Promise<InteractionLog> => {
  try {
    const response = await axios.post(`${API_URL}/interactions`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to create interaction"
    );
  }
};

export const getInteractions = async (
  clientId?: string,
  projectId?: string
): Promise<InteractionLog[]> => {
  try {
    const params = new URLSearchParams();
    if (clientId) params.append("clientId", clientId);
    if (projectId) params.append("projectId", projectId);

    const response = await axios.get(
      `${API_URL}/interactions?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch interactions"
    );
  }
};
