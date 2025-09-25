import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { auth, requireRole } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

/**
 * POST /users/invite
 * Solo ADMIN. Crea usuario en el MISMO tenant del admin.
 * body: { email, role="member", password? }
 * Respuestas de error: { error: "email_in_use" | "invalid_role" }
 */
router.post('/invite', auth, requireRole('admin'), async (req, res) => {
  try {
    const { email, role = 'member', password = '' } = req.body || {};

    if (!email) return res.status(400).json({ error: 'email_required' });
    if (!['admin', 'member'].includes(role)) {
      return res.status(400).json({ error: 'invalid_role' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'email_in_use' });

    const plain = password || process.env.SEED_PASSWORD || 'pass1234';
    const passwordHash = await bcrypt.hash(plain, 10);

    const user = await User.create({
      email,
      role,
      passwordHash,
      tenant: req.user.tenantId
    });

    return res.status(201).json({
      id: String(user._id),
      email: user.email,
      role: user.role,
      tenantId: req.user.tenantId
    });
  } catch (e) {
    return res.status(500).json({ error: 'invite_failed' });
  }
});

export default router;
