const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "jobtrack_access_token";

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function saveToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function parseError(response) {
  try {
    const data = await response.json();
    return data.detail || "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearToken();
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) throw new Error(await parseError(response));
  if (response.status === 204) return null;
  return response.json();
}

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function loginUser(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const response = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });

  if (!response.ok) throw new Error(await parseError(response));
  const data = await response.json();
  saveToken(data.access_token);
  return data;
}

export const getCurrentUser = () => apiFetch("/auth/me");

export async function getApplications(search = "", status = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (status) params.set("status", status);
  const query = params.toString();
  return apiFetch(`/applications${query ? `?${query}` : ""}`);
}

export const createApplication = (payload) =>
  apiFetch("/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const updateApplication = (id, payload) =>
  apiFetch(`/applications/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteApplication = (id) =>
  apiFetch(`/applications/${id}`, { method: "DELETE" });

export const getAnalytics = () => apiFetch("/analytics");
export const getContacts = () => apiFetch("/contacts");

export const createContact = (payload) =>
  apiFetch("/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const updateContact = (id, payload) =>
  apiFetch(`/contacts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteContact = (id) =>
  apiFetch(`/contacts/${id}`, { method: "DELETE" });
