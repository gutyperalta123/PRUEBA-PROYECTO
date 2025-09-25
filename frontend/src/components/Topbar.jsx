export default function Topbar({ user, onLogout, onInviteOpen }) {
  const isPro = user.plan === "pro";
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{background:'linear-gradient(90deg,#0ea5e9,#2563eb)'}}>
      <div className="container">
        <span className="navbar-brand"><i className="bi bi-journal-text me-2"></i>Notes SaaS</span>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="badge rounded-pill" style={{background: isPro?'#14532d':'#1f2937', color: isPro?'#86efac':'#cfe4ff'}}>
            {isPro ? "PRO" : "FREE"}
          </span>
          <span className="text-white-50 small">{user.email} · {user.role} · {user.tenantSlug}</span>
          {user.role === "admin" && (
            <button className="btn btn-sm btn-outline-light" onClick={onInviteOpen} title="Invitar usuario">
              <i className="bi bi-person-plus me-1"></i> Invitar
            </button>
          )}
          <button className="btn btn-sm btn-light" onClick={onLogout}>
            <i className="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
