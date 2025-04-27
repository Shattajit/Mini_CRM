import React from "react";
import "./InteractionLogTable.css";

interface Log {
  id: string;
  date: string;
  interactionType: string;
  notes: string | null;
  client: {
    name: string;
  };
  project: {
    title: string;
  } | null;
}

interface InteractionLogTableProps {
  logs: Log[];
}

const InteractionLogTable: React.FC<InteractionLogTableProps> = ({ logs }) => {
  return (
    <div className="interaction-log-table">
      <h2>Interaction Log List</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Client</th>
              <th>Project</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No interaction logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td>{log.interactionType}</td>
                  <td>{log.client.name}</td>
                  <td>{log.project?.title || "-"}</td>
                  <td>{log.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InteractionLogTable;
