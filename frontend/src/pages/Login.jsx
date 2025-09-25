import { useState } from "react";
import { login } from "../api.js";

export default function Login({ onLogged }){
  const [email,setEmail]=useState("admin@acme.test");
  const [password,setPassword]=useState("pass1234");
  const [err,setErr]=useState(null);
  const [loading,setLoading]=useState(false);

  const submit=async(e)=>{
    e.preventDefault(); setErr(null); setLoading(true);
    try{ const {token,user}=await login(email.trim(),password); onLogged(token,user); }
    catch{ setErr("Credenciales inválidas"); }
    finally{ setLoading(false); }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-xl-4">
          <div className="card glass shadow-lg border-0 login-card">
            <div className="card-body p-4">
              <h1 className="h3 text-center mb-3">Notes SaaS</h1>
              <form onSubmit={submit} className="vstack gap-3">
                <div>
                  <label className="form-label fw-semibold">Email</label>
                  <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@acme.test" />
                </div>
                <div>
                  <label className="form-label fw-semibold">Contraseña</label>
                  <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="pass1234" />
                </div>
                <button className="btn btn-brand w-100" disabled={loading}>
                  {loading? "Ingresando..." : "Ingresar"}
                </button>
                {err && <div className="alert alert-danger py-2">{err}</div>}
                <small className="helper">Cuentas: admin@acme.test, user@acme.test, admin@globex.test, user@globex.test — contraseña: pass1234</small>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
