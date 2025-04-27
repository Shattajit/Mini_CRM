import React, { useState, useEffect } from "react";
import {
  getInteractions,
  createInteraction,
} from "../services/interaction.service";

interface InteractionLogsProps {
  clientId?: string;
  projectId?: string;
}

const InteractionLogs: React.FC<InteractionLogsProps> = ({
  clientId,
  projectId,
}) => {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [newInteraction, setNewInteraction] = useState({
    interactionType: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const data = await getInteractions(clientId, projectId);
        setInteractions(data);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [clientId, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createInteraction({
        ...newInteraction,
        clientId: clientId || "",
        projectId,
      });
      setInteractions([created, ...interactions]);
      setNewInteraction({
        interactionType: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error creating interaction:", error);
    }
  };

  if (loading) return <div>Loading interactions...</div>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Interaction Logs</h3>

      {/* Add new interaction form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Date: </label>
          <input
            type="date"
            value={newInteraction.date}
            onChange={(e) =>
              setNewInteraction({ ...newInteraction, date: e.target.value })
            }
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Type: </label>
          <select
            value={newInteraction.interactionType}
            onChange={(e) =>
              setNewInteraction({
                ...newInteraction,
                interactionType: e.target.value,
              })
            }
            required
          >
            <option value="">Select Type</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Note">Note</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Notes: </label>
          <textarea
            value={newInteraction.notes}
            onChange={(e) =>
              setNewInteraction({ ...newInteraction, notes: e.target.value })
            }
          />
        </div>
        <button type="submit">Add Interaction</button>
      </form>

      {/* Interaction list */}
      <div>
        {interactions.map((interaction) => (
          <div
            key={interaction.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{new Date(interaction.date).toLocaleDateString()}</strong>{" "}
              -{interaction.interactionType}
              {interaction.project && (
                <span> (Project: {interaction.project.title})</span>
              )}
            </div>
            <div>{interaction.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractionLogs;
