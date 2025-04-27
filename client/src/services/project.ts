import axios from "axios";

const API_URL = "http://localhost:5000/api";

interface ProjectData {
  title: string;
  budget: number;
  deadline: string;
  status: string;
  clientId: string;
}

export const getProjects = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch projects"
    );
  }
};

export const createProject = async (
  projectData: Omit<ProjectData, "id">
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/projects`,
      {
        ...projectData,
        budget: Number(projectData.budget),
        deadline: new Date(projectData.deadline).toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Project creation error:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to create project"
    );
  }
};

export const updateProject = async (
  id: string,
  projectData: Partial<ProjectData>
): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/projects/${id}`, {
      ...projectData,
      budget: projectData.budget ? Number(projectData.budget) : undefined,
      deadline: projectData.deadline
        ? new Date(projectData.deadline).toISOString()
        : undefined,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error updating project:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to update project"
    );
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/projects/${id}`);
  } catch (error: any) {
    console.error("Error deleting project:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to delete project"
    );
  }
};
