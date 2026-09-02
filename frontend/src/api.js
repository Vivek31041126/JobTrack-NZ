const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getApplications(search = "", status = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);

  const response = await fetch(`${API_BASE}/applications?${params.toString()}`);
  if (!response.ok) throw new Error("Could not load applications.");
  return response.json();
}

export async function createApplication(payload) {
  const response = await fetch(`${API_BASE}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Could not create application.");
  return response.json();
}

export async function updateApplication(id, payload) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Could not update application.");
  return response.json();
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Could not delete application.");
}

export async function getAnalytics() {
  const response = await fetch(`${API_BASE}/analytics`);
  if (!response.ok) throw new Error("Could not load analytics.");
  return response.json();
}
