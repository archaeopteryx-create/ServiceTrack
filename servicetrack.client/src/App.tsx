import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type RequestPriority = "Low" | "Medium" | "High" | "Urgent";
type RequestStatus = "Open" | "Assigned" | "InProgress" | "Resolved" | "Closed";

type ServiceRequest = {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string | null;
  resolvedAt: string | null;
};

const apiBaseUrl = "http://localhost:5256";

function App() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<RequestPriority>("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function loadRequests() {
    setIsLoading(true);

    const response = await fetch(`${apiBaseUrl}/api/servicerequests`);
    const data = await response.json();

    setRequests(data);
    setIsLoading(false);
  }

  async function createRequest(event: FormEvent) {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    setIsSubmitting(true);

    await fetch(`${apiBaseUrl}/api/servicerequests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        category,
        priority,
        status: "Open",
      }),
    });

    setTitle("");
    setDescription("");
    setCategory("General");
    setPriority("Medium");

    await loadRequests();
    setIsSubmitting(false);
  }

  async function updateStatus(status: RequestStatus) {
    if (!selectedRequest) {
      return;
    }

    setIsUpdatingStatus(true);

    const response = await fetch(
      `${apiBaseUrl}/api/servicerequests/${selectedRequest.id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    const updatedRequest = await response.json();

    setSelectedRequest(updatedRequest);
    await loadRequests();

    setIsUpdatingStatus(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="page">
      <section className="header">
        <div>
          <p className="eyebrow">ServiceTrack</p>
          <h1>Service Requests</h1>
        </div>
        <button onClick={loadRequests}>Refresh</button>
      </section>

      <section className="form-panel">
        <h2>Create Service Request</h2>

        <form onSubmit={createRequest}>
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Cannot access Power BI dashboard"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue or request"
              rows={4}
            />
          </label>

          <div className="form-row">
            <label>
              Category
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="General"
              />
            </label>

            <label>
              Priority
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as RequestPriority)
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Request"}
          </button>
        </form>
      </section>

      <section className="panel">
        {isLoading ? (
          <p>Loading service requests...</p>
        ) : requests.length === 0 ? (
          <p>No service requests yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  onClick={() => setSelectedRequest(request)}
                  className={selectedRequest?.id === request.id ? "selected-row" : ""}
                >
                  <td>{request.id}</td>
                  <td>{request.title}</td>
                  <td>{request.category}</td>
                  <td>{request.priority}</td>
                  <td>
                    <span className={`status ${request.status.toLowerCase()}`}>
                      {request.status}
                    </span>
                  </td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {selectedRequest && (
        <section className="detail-panel">
          <div className="detail-header">
            <div>
              <p className="eyebrow">Selected Request</p>
              <h2>{selectedRequest.title}</h2>
            </div>
            <span className={`status ${selectedRequest.status.toLowerCase()}`}>
              {selectedRequest.status}
            </span>
          </div>

          <p className="description">{selectedRequest.description}</p>

          <div className="detail-grid">
            <div>
              <span>Category</span>
              <strong>{selectedRequest.category}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>{selectedRequest.priority}</strong>
            </div>
            <div>
              <span>Created</span>
              <strong>{new Date(selectedRequest.createdAt).toLocaleString()}</strong>
            </div>
            <div>
              <span>Updated</span>
              <strong>
                {selectedRequest.updatedAt
                  ? new Date(selectedRequest.updatedAt).toLocaleString()
                  : "Not updated"}
              </strong>
            </div>
          </div>

          <div className="status-actions">
            {(["Open", "Assigned", "InProgress", "Resolved", "Closed"] as RequestStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={isUpdatingStatus || selectedRequest.status === status}
                  className="secondary-button"
                >
                  {status}
                </button>
              )
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;