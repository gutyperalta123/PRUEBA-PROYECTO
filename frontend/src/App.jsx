import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Notes from './pages/Notes.jsx';
export default function App(){
  const [token,setToken]=useState(null); const [user,setUser]=useState(null);
  useEffect(()=>{ const t=localStorage.getItem('token'); const u=localStorage.getItem('user'); if(t&&u){ setToken(t); setUser(JSON.parse(u)); } },[]);
  const onLogged=(t,u)=>{ localStorage.setItem('token',t); localStorage.setItem('user',JSON.stringify(u)); setToken(t); setUser(u); };
  const logout=()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setToken(null); setUser(null); };
  return token? <Notes token={token} user={user} onLogout={logout} setUser={setUser}/> : <Login onLogged={onLogged}/>;
}
