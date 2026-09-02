import React, { useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  getAnalytics,
  getApplications,
  updateApplication,
} from "./api";

const STATUSES = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

const initialForm = {
  company: "",
  role: "",
  location: "Auckland, New Zealand",
  status: "Applied",
  source: "LinkedIn",
  applied_date: new Date().toISOString().slice(0, 10),
  contact_name: "",
  contact_email: "",
  job_url: "",
  notes: "",
};

function App() {
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [apps, stats] = await Promise.all([
        getApplications(search, statusFilter),
        getAnalytics(),
      ]);
      setApplications(apps);
      setAnalytics(stats);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    load();
  }, [search, statusFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createApplication(form);
      setForm(initialForm);
      setMessage("Application added successfully.");
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await updateApplication(id, { status });
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteApplication(id);
      await load();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Full-Stack Portfolio Project</p>
          <h1>JobTrack NZ</h1>
          <p className="subtitle">
            Track applications, interviews, recruiters and outcomes in one place.
          </p>
        </div>
        <div className="api-pill">React + FastAPI + PostgreSQL</div>
      </header>

      <section className="metrics">
        <Metric label="Total" value={analytics.total} />
        <Metric label="Applied" value={analytics.applied} />
        <Metric label="Screening" value={analytics.screening} />
        <Metric label="Interview" value={analytics.interview} />
        <Metric label="Offers" value={analytics.offer} />
      </section>

      <section className="grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">New application</p>
              <h2>Add a job</h2>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <Field label="Company">
              <input
                required
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="e.g. Xero"
              />
            </Field>

            <Field label="Role">
              <input
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. Graduate Software Developer"
              />
            </Field>

            <div className="form-row">
              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="form-row">
              <Field label="Source">
                <input
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  placeholder="LinkedIn / SEEK / Recruiter"
                />
              </Field>

              <Field label="Applied date">
                <input
                  type="date"
                  required
                  value={form.applied_date}
                  onChange={(e) =>
                    setForm({ ...form, applied_date: e.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Job URL">
              <input
                value={form.job_url}
                onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                placeholder="https://..."
              />
            </Field>

            <Field label="Notes">
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Recruiter name, follow-up date, interview notes..."
              />
            </Field>

            <button className="primary" type="submit">
              Add application
            </button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>

        <div className="panel">
          <div className="panel-heading list-heading">
            <div>
              <p className="eyebrow">Pipeline</p>
              <h2>Your applications</h2>
            </div>
          </div>

          <div className="filters">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company or role..."
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="application-list">
            {applications.length === 0 ? (
              <div className="empty">No applications found yet.</div>
            ) : (
              applications.map((app) => (
                <article className="application-card" key={app.id}>
                  <div className="card-top">
                    <div>
                      <h3>{app.role}</h3>
                      <p>{app.company}</p>
                    </div>
                    <span className={`status status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="meta">
                    <span>{app.location || "Location not set"}</span>
                    <span>{app.applied_date}</span>
                    <span>{app.source || "Source not set"}</span>
                  </div>

                  {app.notes && <p className="notes">{app.notes}</p>}

                  <div className="card-actions">
                    <select
                      value={app.status}
                      onChange={(e) => changeStatus(app.id, e.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    {app.job_url && (
                      <a
                        href={app.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View job ↗
                      </a>
                    )}

                    <button className="danger" onClick={() => remove(app.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default App;
