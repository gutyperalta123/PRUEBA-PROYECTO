import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
const router = Router();
router.post('/login', async (req,res)=>{
  const {email,password}=req.body||{};
  if(!email||!password) return res.status(400).json({error:'missing_credentials'});
  const user = await User.findOne({email}).populate('tenant');
  if(!user) return res.status(401).json({error:'invalid_login'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({error:'invalid_login'});
  const token = jwt.sign({uid:String(user._id)}, process.env.JWT_SECRET, {expiresIn:'7d'});
  res.json({ token, user: { id:user._id, email:user.email, role:user.role, tenantId:user.tenant._id, tenantSlug:user.tenant.slug, plan:user.tenant.plan } });
});
router.post('/seed', async (_req,res)=>{
  const seedPwd = process.env.SEED_PASSWORD || 'pass1234';
  const hash = await bcrypt.hash(seedPwd,10);
  const ensureTenant = async (name,slug)=>{ let t = await Tenant.findOne({slug}); if(!t) t=await Tenant.create({name,slug,plan:'free'}); return t; };
  const acme = await ensureTenant('Acme','acme'); const globex = await ensureTenant('Globex','globex');
  const ensureUser = async (email,role,tenant)=>{ const f = await User.findOne({email}); if(!f) await User.create({email,role,tenant:tenant._id,passwordHash:hash}); };
  await ensureUser('admin@acme.test','admin',acme);
  await ensureUser('user@acme.test','member',acme);
  await ensureUser('admin@globex.test','admin',globex);
  await ensureUser('user@globex.test','member',globex);
  res.json({ok:true, seedPassword: seedPwd});
});
export default router;
