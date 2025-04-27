import React, { useEffect, useState } from "react";
import {
  createInteraction,
  getInteractions,
} from "../../services/interaction.service";

const ClientItem = ({ client, onUpdate, onDelete }: any) => {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [newInteraction, setNewInteraction] = useState({
    date: "",
    type: "Call",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadInteractions();
  }, []);

  const loadInteractions = async () => {
    try {
      const allInteractions = await getInteractions();
      const clientInteractions = allInteractions.filter(
        (interaction: any) => interaction.clientId === client.id
      );
      setInteractions(clientInteractions);
    } catch (error) {
      console.error("Error loading interactions:", error);
    }
  };

  const handleCreateInteraction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newInteraction.date || !newInteraction.type) {
      setError("Date and Type are required.");
      return;
    }

    try {
      const interactionData = {
        clientId: client.id,
        projectId: "",
        interactionType: newInteraction.type,
        date: newInteraction.date,
        notes: newInteraction.notes,
      };

      await createInteraction(interactionData);
      setNewInteraction({ date: "", type: "Call", notes: "" }); // Reset form
      setError("");
      loadInteractions(); // Reload updated interactions
    } catch (error) {
      console.error("Error creating interaction:", error);
      setError("Failed to create interaction.");
    }
  };

  const handleUpdate = () => {
    const updatedClient = { ...client, name: "Updated Name" }; // Example update
    onUpdate(client.id, updatedClient);
  };

  const handleDelete = () => {
    onDelete(client.id);
  };

  return (
    <li
      style={{
        marginBottom: "30px",
        border: "1px solid gray",
        padding: "10px",
      }}
    >
      <div>
        <strong>Name:</strong> {client.name}
      </div>
      <div>
        <strong>Email:</strong> {client.email}
      </div>
      <div>
        <strong>Phone:</strong> {client.phone}
      </div>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>

      {/* Interaction Log Section */}
      <div style={{ marginTop: "15px" }}>
        <h4>Interaction Logs</h4>

        {interactions.length > 0 ? (
          <ul>
            {interactions.map((interaction) => (
              <li key={interaction.id}>
                <div>
                  <strong>Date:</strong> {interaction.date}
                </div>
                <div>
                  <strong>Type:</strong> {interaction.interactionType}
                </div>
                <div>
                  <strong>Notes:</strong> {interaction.notes}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No interactions found.</p>
        )}

        {/* Form to add new interaction */}
        <form onSubmit={handleCreateInteraction} style={{ marginTop: "10px" }}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={newInteraction.date}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, date: e.target.value })
              }
            />
          </div>
          <div>
            <label>Type:</label>
            <select
              value={newInteraction.type}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, type: e.target.value })
              }
            >
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <div>
            <label>Notes:</label>
            <textarea
              value={newInteraction.notes}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, notes: e.target.value })
              }
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Add Interaction</button>
        </form>
      </div>
    </li>
  );
};

export default ClientItem;
