import { Router } from 'express';
import Tenant from '../models/Tenant.js';
import { auth, requireRole } from '../middleware/auth.js';
const router = Router();
router.post('/:slug/upgrade', auth, requireRole('admin'), async (req,res)=>{
  const {slug}=req.params; if(slug!==req.user.tenantSlug) return res.status(403).json({error:'forbidden'});
  const t = await Tenant.findOneAndUpdate({slug},{ $set:{plan:'pro'} },{new:true}); if(!t) return res.status(404).json({error:'tenant_not_found'});
  res.json({ok:true, plan:t.plan});
});
export default router;
