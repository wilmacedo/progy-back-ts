import { Router } from 'express';
import { info } from '../../controllers/dashboard';
import { permission, roles, verify } from '../../middleware';
import { AuthController } from '../../middleware/auth';

const router = Router();
const auth = new AuthController();

router.use(auth.verify, verify(roles.low), permission);

router.get('/', info);

export default router;
