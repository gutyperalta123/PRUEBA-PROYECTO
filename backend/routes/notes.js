import { Router } from 'express';
import Note from '../models/Note.js';
import Tenant from '../models/Tenant.js';
import { auth, reloadTenant } from '../middleware/auth.js';
const router = Router();
router.post('/', auth, reloadTenant, async (req,res)=>{
  const {title,content=''}=req.body||{}; if(!title) return res.status(400).json({error:'title_required'});
  const t = await Tenant.findById(req.user.tenantId); if(!t) return res.status(404).json({error:'tenant_not_found'});
  if(t.plan==='free'){ const c = await Note.countDocuments({tenant:req.user.tenantId}); if(c>=3) return res.status(402).json({error:'free_limit_reached',limit:3}); }
  const note = await Note.create({tenant:req.user.tenantId,user:req.user.id,title,content}); res.status(201).json(note);
});
router.get('/', auth, async (req,res)=>{ const notes = await Note.find({tenant:req.user.tenantId}).sort({createdAt:-1}); res.json(notes); });
router.get('/:id', auth, async (req,res)=>{ const n = await Note.findOne({_id:req.params.id,tenant:req.user.tenantId}); if(!n) return res.status(404).json({error:'not_found'}); res.json(n); });
router.put('/:id', auth, async (req,res)=>{ const {title,content}=req.body||{}; const n=await Note.findOneAndUpdate({_id:req.params.id,tenant:req.user.tenantId},{ $set: { ...(title!=null?{title}:{}) , ...(content!=null?{content}:{}) } },{new:true}); if(!n) return res.status(404).json({error:'not_found'}); res.json(n); });
router.delete('/:id', auth, async (req,res)=>{ const d=await Note.findOneAndDelete({_id:req.params.id,tenant:req.user.tenantId}); if(!d) return res.status(404).json({error:'not_found'}); res.json({ok:true}); });
export default router;
