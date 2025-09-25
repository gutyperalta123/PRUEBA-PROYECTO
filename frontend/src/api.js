const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function jreq(path, opts = {}) {
  const url = `${API}${path}`;
  const base = { headers: {} };
  if (opts.json) {
    base.headers["content-type"] = "application/json";
    opts.body = JSON.stringify(opts.json);
    delete opts.json;
  }
  const r = await fetch(url, { ...base, ...opts });
  let data = null;
  try { data = await r.json(); } catch { data = null; }
  if (!r.ok) throw new Error(data?.error || data?.message || `${r.status}`);
  return data ?? {};
}

export const login = (email, password) =>
  jreq("/auth/login", { method: "POST", json: { email, password} });

export const getNotes = (token) =>
  jreq("/notes", { headers: { Authorization: `Bearer ${token}` } });

export const createNote = (token, payload) =>
  jreq("/notes", { method: "POST", headers: { Authorization: `Bearer ${token}` }, json: payload });

export const updateNote = (token, id, payload) =>
  jreq(`/notes/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, json: payload });

export const deleteNote = (token, id) =>
  jreq(`/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });

export const upgradeToPro = (token, slug) =>
  jreq(`/tenants/${slug}/upgrade`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });

export const inviteUser = (token, { email, role = "member", password = "" }) =>
  jreq("/users/invite", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    json: { email, role, ...(password ? { password } : {}) }
  });
