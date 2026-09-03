import React, { useEffect, useState } from "react";
import {
  clearToken, createApplication, createContact, deleteApplication, deleteContact,
  getAnalytics, getApplications, getContacts, getCurrentUser, getToken,
  loginUser, registerUser, updateApplication, updateContact,
} from "./api";

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];
const CONTACT_STAGES = ["New Contact", "Connected", "CV Sent", "Following Up", "Interview Contact"];

const initialApplicationForm = {
  company: "", role: "", location: "Auckland, New Zealand", status: "Applied",
  source: "LinkedIn", applied_date: new Date().toISOString().slice(0, 10),
  contact_name: "", contact_email: "", job_url: "", notes: "",
};

const initialContactForm = {
  name: "", company: "", email: "", phone: "", linkedin_url: "",
  relationship_stage: "New Contact", next_follow_up: "", notes: "",
};

function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [user, setUser] = useState(null);
  const [view, setView] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0, applied: 0, screening: 0, interview: 0, offer: 0, rejected: 0,
    interview_rate: 0, offer_rate: 0,
  });
  const [form, setForm] = useState(initialApplicationForm);
  const [contactForm, setContactForm] = useState(initialContactForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");

  const loadAll = async () => {
    try {
      const [apps, stats, currentUser, contactList] = await Promise.all([
        getApplications(search, statusFilter), getAnalytics(), getCurrentUser(), getContacts()
      ]);
      setApplications(apps);
      setAnalytics(stats);
      setUser(currentUser);
      setContacts(contactList);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
      if (!getToken()) {
        setAuthenticated(false);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (authenticated) loadAll();
  }, [authenticated, search, statusFilter]);

  if (!authenticated) {
    return <AuthScreen onAuthenticated={() => setAuthenticated(true)} />;
  }

  const logout = () => {
    clearToken();
    setAuthenticated(false);
    setUser(null);
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    try {
      await createApplication(form);
      setForm(initialApplicationForm);
      setMessage("Application added.");
      await loadAll();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    try {
      await createContact({
        ...contactForm,
        next_follow_up: contactForm.next_follow_up || null,
      });
      setContactForm(initialContactForm);
      setMessage("Recruiter/contact saved.");
      await loadAll();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-Stack Portfolio Project · Version 3</p>
          <h1>JobTrack NZ</h1>
          <p className="subtitle">Manage applications, recruitment progress and professional contacts.</p>
        </div>
        <div className="account-box">
          <div>
            <strong>{user?.full_name || "JobTrack User"}</strong>
            <span>{user?.email}</span>
          </div>
          <button className="secondary-button" onClick={logout}>Sign out</button>
        </div>
      </header>

      <nav className="product-nav">
        <button className={view === "applications" ? "active" : ""} onClick={() => setView("applications")}>
          Applications
        </button>
        <button className={view === "contacts" ? "active" : ""} onClick={() => setView("contacts")}>
          Recruiters & Contacts
        </button>
      </nav>

      <AnalyticsDashboard analytics={analytics} />

      {view === "applications" ? (
        <section className="grid">
          <div className="panel">
            <p className="eyebrow">New application</p>
            <h2>Add a job</h2>
            <form className="form" onSubmit={submitApplication}>
              <Field label="Company">
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </Field>
              <Field label="Role">
                <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </Field>
              <div className="form-row">
                <Field label="Location">
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </Field>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div className="form-row">
                <Field label="Source">
                  <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
                </Field>
                <Field label="Applied date">
                  <input type="date" required value={form.applied_date} onChange={(e) => setForm({ ...form, applied_date: e.target.value })} />
                </Field>
              </div>
              <Field label="Job URL">
                <input value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} />
              </Field>
              <Field label="Notes">
                <textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>
              <button className="primary" type="submit">Add application</button>
            </form>
          </div>

          <div className="panel">
            <p className="eyebrow">Private pipeline</p>
            <h2>Your applications</h2>
            <div className="filters">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or role..." />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="application-list">
              {applications.length === 0 ? <div className="empty">No applications found.</div> :
                applications.map((app) => (
                  <article className="application-card" key={app.id}>
                    <div className="card-top">
                      <div><h3>{app.role}</h3><p>{app.company}</p></div>
                      <span className="status">{app.status}</span>
                    </div>
                    <div className="meta">
                      <span>{app.location}</span><span>{app.applied_date}</span><span>{app.source}</span>
                    </div>
                    {app.notes && <p className="notes">{app.notes}</p>}
                    <div className="card-actions">
                      <select value={app.status} onChange={async (e) => {
                        await updateApplication(app.id, { status: e.target.value });
                        await loadAll();
                      }}>
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {app.job_url && <a href={app.job_url} target="_blank" rel="noopener noreferrer">View job ↗</a>}
                      <button className="danger" onClick={async () => {
                        if (!window.confirm("Delete this application?")) return;
                        await deleteApplication(app.id); await loadAll();
                      }}>Delete</button>
                    </div>
                  </article>
                ))
              }
            </div>
          </div>
        </section>
      ) : (
        <section className="grid">
          <div className="panel">
            <p className="eyebrow">Networking CRM</p>
            <h2>Add a contact</h2>
            <form className="form" onSubmit={submitContact}>
              <Field label="Name">
                <input required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
              </Field>
              <Field label="Company / Agency">
                <input required value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} />
              </Field>
              <div className="form-row">
                <Field label="Email">
                  <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                </Field>
                <Field label="Phone">
                  <input value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                </Field>
              </div>
              <Field label="LinkedIn URL">
                <input value={contactForm.linkedin_url} onChange={(e) => setContactForm({ ...contactForm, linkedin_url: e.target.value })} />
              </Field>
              <div className="form-row">
                <Field label="Relationship stage">
                  <select value={contactForm.relationship_stage}
                    onChange={(e) => setContactForm({ ...contactForm, relationship_stage: e.target.value })}>
                    {CONTACT_STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Next follow-up">
                  <input type="date" value={contactForm.next_follow_up}
                    onChange={(e) => setContactForm({ ...contactForm, next_follow_up: e.target.value })} />
                </Field>
              </div>
              <Field label="Notes">
                <textarea rows="4" value={contactForm.notes} onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })} />
              </Field>
              <button className="primary" type="submit">Save contact</button>
            </form>
          </div>

          <div className="panel">
            <p className="eyebrow">Professional network</p>
            <h2>Recruiters & contacts</h2>
            <div className="contact-list">
              {contacts.length === 0 ? <div className="empty">No contacts saved yet.</div> :
                contacts.map((contact) => (
                  <article className="contact-card" key={contact.id}>
                    <div className="card-top">
                      <div><h3>{contact.name}</h3><p>{contact.company}</p></div>
                      <span className="status">{contact.relationship_stage}</span>
                    </div>
                    <div className="contact-details">
                      {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                      {contact.phone && <span>{contact.phone}</span>}
                      {contact.next_follow_up && <span>Follow up: {contact.next_follow_up}</span>}
                    </div>
                    {contact.notes && <p className="notes">{contact.notes}</p>}
                    <div className="card-actions">
                      <select value={contact.relationship_stage} onChange={async (e) => {
                        await updateContact(contact.id, { relationship_stage: e.target.value });
                        await loadAll();
                      }}>
                        {CONTACT_STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {contact.linkedin_url && <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
                      <button className="danger" onClick={async () => {
                        if (!window.confirm("Delete this contact?")) return;
                        await deleteContact(contact.id); await loadAll();
                      }}>Delete</button>
                    </div>
                  </article>
                ))
              }
            </div>
          </div>
        </section>
      )}

      {message && <p className="global-message">{message}</p>}
    </main>
  );
}

function AnalyticsDashboard({ analytics }) {
  const rows = [
    ["Applied", analytics.applied],
    ["Screening", analytics.screening],
    ["Interview", analytics.interview],
    ["Offer", analytics.offer],
    ["Rejected", analytics.rejected],
  ];
  const max = Math.max(...rows.map(([, v]) => v), 1);

  return (
    <>
      <section className="metrics">
        <Metric label="Total" value={analytics.total} />
        <Metric label="Interview Rate" value={`${analytics.interview_rate}%`} />
        <Metric label="Offer Rate" value={`${analytics.offer_rate}%`} />
        <Metric label="Interviews" value={analytics.interview} />
        <Metric label="Offers" value={analytics.offer} />
      </section>
      <section className="analytics-panel">
        <div className="analytics-heading">
          <div><p className="eyebrow">Analytics</p><h2>Application pipeline</h2></div>
          <span>{analytics.total} applications tracked</span>
        </div>
        <div className="bar-chart">
          {rows.map(([label, value]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.max((value / max) * 100, value ? 4 : 0)}%` }} />
              </div>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await registerUser({ full_name: fullName, email, password });
      await loginUser(email, password);
      onAuthenticated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-brand">
        <p className="eyebrow">React + FastAPI + PostgreSQL</p>
        <h1>JobTrack NZ</h1>
        <p>A secure full-stack platform for managing applications and professional relationships.</p>
        <div className="auth-features">
          <span>JWT Authentication</span><span>Analytics</span><span>Recruiter CRM</span><span>Protected REST API</span>
        </div>
      </section>
      <section className="auth-card">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "Create your account"}</p>
        <h2>{mode === "login" ? "Sign in" : "Register"}</h2>
        <form className="form" onSubmit={submit}>
          {mode === "register" && <Field label="Full name">
            <input required minLength="2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </Field>}
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <input type="password" required minLength="8" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && <p className="auth-error">{error}</p>}
          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button className="auth-switch" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "New to JobTrack? Create an account" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return <div className="metric-card"><strong>{value}</strong><span>{label}</span></div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

export default App;
