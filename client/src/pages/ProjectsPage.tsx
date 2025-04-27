import React, { useState, useEffect } from "react";
import axios from "axios";
import InteractionLogs from "./InteractionLogs";

interface Project {
  id: string;
  title: string;
  budget: number;
  deadline: string;
  status: string;
  clientId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    budget: 0,
    deadline: "",
    status: "",
    clientId: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await axios.get("/api/auth/clients");
      setClients(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      budget: parseFloat(formData.budget.toString()),
    };

    try {
      if (editingId) {
        await axios.put(`/api/projects/${editingId}`, updatedFormData);
      } else {
        await axios.post("/api/projects", updatedFormData);
      }
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      budget: project.budget,
      deadline: project.deadline.split("T")[0],
      status: project.status,
      clientId: project.clientId,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await axios.delete(`/api/projects/${id}`);
      // Reset selected if viewing interactions for deleted project
      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      budget: 0,
      deadline: "",
      status: "",
      clientId: "",
    });
  };

  const handleSelectProject = (projectId: string, clientId: string) => {
    setSelectedProjectId(projectId === selectedProjectId ? null : projectId);
    setSelectedClientId(clientId);
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Left side - Projects list and form */}
      <div style={{ flex: 1 }}>
        <div style={boxStyle}>
          <h2>{editingId ? "Edit Project" : "Create Project"}</h2>
          <form onSubmit={handleCreateOrUpdate}>
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={formData.title}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="number"
              name="budget"
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>

            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Client</option>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.email}
                  </option>
                ))
              ) : (
                <option>No clients available</option>
              )}
            </select>

            <div style={{ marginTop: "10px" }}>
              <button type="submit" style={buttonStyle}>
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ ...buttonStyle, backgroundColor: "gray" }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={boxStyle}>
          <h2>Projects List</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Budget</th>
                <th style={thStyle}>Deadline</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Client</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  style={{
                    backgroundColor:
                      selectedProjectId === project.id ? "#f0f7ff" : "inherit",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleSelectProject(project.id, project.clientId)
                  }
                >
                  <td style={tdStyle}>{project.title}</td>
                  <td style={tdStyle}>${project.budget}</td>
                  <td style={tdStyle}>
                    {new Date(project.deadline).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{project.status}</td>
                  <td style={tdStyle}>
                    {clients.find((c) => c.id === project.clientId)?.email ||
                      "Unknown"}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(project);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      style={{ marginLeft: "8px" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side - Interaction logs */}
      <div style={{ flex: 1 }}>
        {selectedProjectId ? (
          <>
            <h2>Project Interactions</h2>
            <InteractionLogs
              projectId={selectedProjectId}
              clientId={selectedClientId || ""}
            />
          </>
        ) : (
          <div style={boxStyle}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "200px",
                color: "#666",
              }}
            >
              <p>Select a project to view its interaction logs</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Keep your existing style definitions
const boxStyle = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: "10px",
};

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#f2f2f2",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
};

export default ProjectsPage;
