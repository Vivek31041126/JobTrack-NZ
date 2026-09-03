const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "jobtrack_access_token";
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
async function errorText(r){try{const d=await r.json();return d.detail||"Something went wrong."}catch{return "Something went wrong."}}
async function apiFetch(path, options={}){const token=getToken();const headers={...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const r=await fetch(`${API_BASE}${path}`,{...options,headers});if(r.status===401){clearToken();throw new Error("Your session has expired. Please sign in again.")}if(!r.ok)throw new Error(await errorText(r));if(r.status===204)return null;return r.json();}
export async function registerUser(payload){const r=await fetch(`${API_BASE}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error(await errorText(r));return r.json();}
export async function loginUser(email,password){const form=new URLSearchParams({username:email,password});const r=await fetch(`${API_BASE}/auth/token`,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:form});if(!r.ok)throw new Error(await errorText(r));const d=await r.json();saveToken(d.access_token);return d;}
export const getCurrentUser=()=>apiFetch("/auth/me");
export async function getApplications(search="",status=""){const p=new URLSearchParams();if(search)p.set("search",search);if(status)p.set("status",status);const q=p.toString();return apiFetch(`/applications${q?`?${q}`:""}`)}
export const createApplication=(payload)=>apiFetch("/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
export const updateApplication=(id,payload)=>apiFetch(`/applications/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
export const deleteApplication=(id)=>apiFetch(`/applications/${id}`,{method:"DELETE"});
export const getAnalytics=()=>apiFetch("/analytics");
