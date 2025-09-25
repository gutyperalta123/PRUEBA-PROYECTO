import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
export const auth = async (req,res,next)=>{
  try{
    const h = req.headers.authorization||''; const t = h.startsWith('Bearer ')?h.slice(7):null;
    if(!t) return res.status(401).json({error:'missing_token'});
    const p = jwt.verify(t, process.env.JWT_SECRET);
    const user = await User.findById(p.uid).populate('tenant');
    if(!user) return res.status(401).json({error:'invalid_user'});
    req.user = { id: String(user._id), role: user.role, tenantId: String(user.tenant._id), tenantSlug: user.tenant.slug, plan: user.tenant.plan };
    next();
  }catch(e){ return res.status(401).json({error:'invalid_token'});}
};
export const requireRole = role => (req,res,next)=>{ if(!req.user||req.user.role!==role) return res.status(403).json({error:'forbidden'}); next(); };
export const reloadTenant = async (req,_res,next)=>{ const t = await Tenant.findById(req.user.tenantId); if(t) req.user.plan=t.plan; next(); };
