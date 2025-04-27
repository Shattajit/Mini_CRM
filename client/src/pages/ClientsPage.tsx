import React, { useState, useEffect } from "react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/client";
import ClientItem from "../components/clients/ClientItem";
import InteractionLogs from "./InteractionLogs";

const ClientsPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null); // Tracking selected client for interactions

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients");
      }
    };
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClient.name || !newClient.email || !newClient.phone) {
      setError("Name, email, and phone are required.");
      return;
    }

    try {
      const createdClient = await createClient(newClient);
      setClients([...clients, createdClient]);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
      });
      setError("");
    } catch (err) {
      console.error("Error creating client:", err);
      setError("Failed to create client.");
    }
  };

  const handleUpdateClient = async (id: string, updatedClient: any) => {
    try {
      const updated = await updateClient(id, updatedClient);
      setClients(
        clients.map((client) => (client.id === id ? updated : client))
      );
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Failed to update client.");
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClient(id);
      setClients(clients.filter((client) => client.id !== id));
      // Resetting selected client if it was deleted
      if (selectedClientId === id) {
        setSelectedClientId(null);
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Failed to delete client.");
    }
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId === selectedClientId ? null : clientId);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* Left side - Client list and form */}
      <div style={{ flex: 1 }}>
        <h2>Clients</h2>

        {/* Client creation form */}
        <form onSubmit={handleCreateClient} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "10px" }}>
            <label>Name:</label>
            <input
              type="text"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Email:</label>
            <input
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Phone:</label>
            <input
              type="text"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Company (Optional):</label>
            <input
              type="text"
              value={newClient.company}
              onChange={(e) =>
                setNewClient({ ...newClient, company: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>Notes (Optional):</label>
            <textarea
              value={newClient.notes}
              onChange={(e) =>
                setNewClient({ ...newClient, notes: e.target.value })
              }
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Create Client</button>
        </form>

        {/* Displaying the list of clients */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {clients.map((client) => (
            <li
              key={client.id}
              style={{
                marginBottom: "10px",
                border:
                  selectedClientId === client.id
                    ? "2px solid blue"
                    : "1px solid #ddd",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => handleSelectClient(client.id)}
            >
              <ClientItem
                client={client}
                onUpdate={handleUpdateClient}
                onDelete={handleDeleteClient}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Interaction logs for selected client */}
      <div style={{ flex: 1 }}>
        {selectedClientId ? (
          <>
            <h2>Client Interactions</h2>
            <InteractionLogs clientId={selectedClientId} />
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#666",
            }}
          >
            <p>Select a client to view their interaction logs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
