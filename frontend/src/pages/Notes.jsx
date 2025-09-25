import { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import { getNotes, createNote, deleteNote, updateNote, upgradeToPro, inviteUser } from "../api.js";

export default function Notes({ token, user, onLogout, setUser }){
  const [notes,setNotes]=useState([]); const [title,setTitle]=useState(""); const [content,setContent]=useState("");
  const [msg,setMsg]=useState(null); const [err,setErr]=useState(null);
  const [editing,setEditing]=useState(null);

  const [inviteOpen,setInviteOpen]=useState(false);
  const [inviteEmail,setInviteEmail]=useState(""); const [inviteRole,setInviteRole]=useState("member");
  const [inviteErr,setInviteErr]=useState(null); const [inviteOk,setInviteOk]=useState(null);

  const load=async()=>{ setErr(null); try{ const list=await getNotes(token); setNotes(Array.isArray(list)?list:[]);}catch{ setErr("Error cargando notas"); } };
  useEffect(()=>{ load(); },[]);

  const add=async()=>{ setErr(null); try{
      const n=await createNote(token,{title:title.trim(),content:content.trim()}); setTitle(""); setContent(""); setNotes(prev=>[n,...prev]); setMsg(null);
    }catch(e){ String(e.message).includes("free_limit_reached") ? setMsg("Límite del plan Free alcanzado.") : setErr("No se pudo crear la nota"); }
  };

  const del=async(id)=>{ try{ await deleteNote(token,id); setNotes(prev=>prev.filter(n=>n._id!==id)); }catch{ setErr("No se pudo eliminar la nota"); } };
  const startEdit=(n)=>{ setEditing({ ...n }); };
  const saveEdit=async()=>{ try{ const n=await updateNote(token, editing._id, { title: editing.title.trim(), content: editing.content.trim() }); setNotes(prev=>prev.map(x=>x._id===n._id?n:x)); setEditing(null);}catch{ setErr("No se pudo actualizar la nota"); } };

  const doUpgrade=async()=>{ try{ await upgradeToPro(token, user.tenantSlug); setMsg(null); setUser({...user, plan:"pro"});}catch{ setErr("No autorizado para actualizar plan"); } };

  const doInvite=async()=> {
    setInviteErr(null); setInviteOk(null);
    try{
      await inviteUser(token, { email: inviteEmail.trim(), role: inviteRole });
      setInviteOk("Usuario invitado. Contraseña temporal: pass1234");
      setInviteEmail(""); setInviteRole("member"); setInviteOpen(false);
    }catch(e){
      setInviteErr(e.message==="email_in_use" ? "El email ya existe." : e.message==="invalid_role" ? "Rol inválido." : "No se pudo invitar al usuario.");
    }
  };

  return (<>
    <Topbar user={user} onLogout={onLogout} onInviteOpen={()=>setInviteOpen(true)} />
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card glass h-100">
            <div className="card-body">
              <h5 className="card-title">Nueva nota</h5>
              <div className="vstack gap-2">
                <label className="form-label m-0">Título</label>
                <input className="form-control" placeholder="Escribe un título" value={title} onChange={e=>setTitle(e.target.value)} />
                <label className="form-label m-0">Contenido</label>
                <textarea className="form-control" rows="3" placeholder="Escribe el contenido" value={content} onChange={e=>setContent(e.target.value)} />
                <button className="btn btn-brand" onClick={add}><i className="bi bi-plus-circle me-1"></i>Guardar</button>
                {msg && <div className="alert alert-warning d-flex justify-content-between align-items-center">
                  <div><i className="bi bi-exclamation-triangle me-2"></i>{msg}</div>
                  {user.role==="admin" && <button className="btn btn-sm btn-warning" onClick={doUpgrade}><i className="bi bi-lightning-charge me-1"></i>Actualizar a Pro</button>}
                </div>}
                {err && <div className="alert alert-danger">{err}</div>}
                {inviteOk && <div className="alert alert-success py-2">{inviteOk}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="m-0">Tus notas</h5>
            <span className="text-muted small">{notes.length} notas</span>
          </div>
          <div className="row g-3">
            {notes.map(n=>(
              <div key={n._id} className="col-md-6">
                <div className="card glass note-card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title">{n.title}</h6>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-light" onClick={()=>startEdit(n)} title="Editar"><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-outline-danger" onClick={()=>del(n._id)} title="Eliminar"><i className="bi bi-trash"></i></button>
                      </div>
                    </div>
                    <p className="card-text text-muted">{n.content}</p>
                    <div className="mt-auto">
                      <span className="badge bg-secondary">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!notes.length && <div className="text-danger">No hay notas todavía.</div>}
          </div>
        </div>
      </div>
    </div>

    {/* Modal de invitación (solo admin) */}
    {inviteOpen && user.role==="admin" && (
      <div className="modal d-block" tabIndex="-1" style={{background:"rgba(0,0,0,.5)"}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title"><i className="bi bi-person-plus me-2"></i>Invitar usuario</h5>
              <button type="button" className="btn-close" onClick={()=>setInviteOpen(false)}></button>
            </div>
            <div className="modal-body vstack gap-2">
              <div>
                <label className="form-label">Email</label>
                <input className="form-control" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="nuevo@tu-empresa.test" />
              </div>
              <div>
                <label className="form-label">Rol</label>
                <select className="form-select" value={inviteRole} onChange={e=>setInviteRole(e.target.value)}>
                  <option value="member">Miembro</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {inviteErr && <div className="alert alert-danger py-2">{inviteErr}</div>}
              <small className="text-muted">Si no indicas contraseña, se usará la temporal <strong>pass1234</strong>.</small>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={()=>setInviteOpen(false)}>Cancelar</button>
              <button className="btn btn-brand" onClick={doInvite}><i className="bi bi-send me-1"></i>Invitar</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Modal de edición */}
    {editing && <div className="modal d-block" tabIndex="-1" style={{background:"rgba(0,0,0,.5)"}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar nota</h5>
            <button type="button" className="btn-close" onClick={()=>setEditing(null)}></button>
          </div>
          <div className="modal-body vstack gap-2">
            <label className="form-label m-0">Título</label>
            <input className="form-control" value={editing.title} onChange={e=>setEditing({...editing, title:e.target.value})} />
            <label className="form-label m-0">Contenido</label>
            <textarea className="form-control" rows="4" value={editing.content} onChange={e=>setEditing({...editing, content:e.target.value})}></textarea>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={()=>setEditing(null)}>Cancelar</button>
            <button className="btn btn-brand" onClick={saveEdit}><i className="bi bi-check2-circle me-1"></i>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>}
  </>);
}
